#!/usr/bin/env python3
"""Backup central dos projetos públicos marcados por LCR_START; sem PC local."""
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from urllib.parse import quote

def api(path, token):
    headers={"Accept":"application/vnd.github+json","User-Agent":"LCR-Central-Backup"}
    if token:
        headers["Authorization"]="Bearer "+token
    try:
        with urlopen(Request("https://api.github.com"+path,headers=headers),timeout=40) as response:
            return json.load(response)
    except HTTPError as e:
        if e.code==404:
            return None
        raise

def eligible(repo,owner):
    return (repo.get("visibility")=="public" and not repo.get("archived")
            and not repo.get("fork") and repo.get("owner",{}).get("login","").lower()==owner.lower())

def discover(owner,central,token):
    found={}
    for page in range(1,11):
        entries=api(f"/users/{quote(owner)}/repos?per_page=100&page={page}",token)
        if not isinstance(entries,list):
            raise RuntimeError("Falha ao listar repositórios públicos")
        for item in entries:
            if not eligible(item,owner):
                continue
            name=item["name"]
            full=owner+"/"+name
            if full.lower()==central.lower() or (api(
                f"/repos/{quote(owner)}/{quote(name)}/contents/documentation/LCR_START.md",token
            ) or {}).get("type")=="file":
                found[full]={"name":name,"full":full,"branch":item.get("default_branch") or "main"}
        if len(entries)<100:
            break
    if not any(k.lower()==central.lower() for k in found):
        raise RuntimeError("Repositório controlador ausente; nenhuma cópia realizada")
    return [found[k] for k in sorted(found)]

def run(*args,cwd=None):
    subprocess.run(args,cwd=cwd,check=True)

def backup(item,date):
    with tempfile.TemporaryDirectory(prefix="lcr-backup-") as d:
        root=Path(d)
        clone=root/"repository"
        out=root/"snapshots"
        out.mkdir()
        run("git","clone","--single-branch","--branch",item["branch"],
            "https://github.com/"+item["full"]+".git",str(clone))
        sha=subprocess.check_output(["git","rev-parse","--short=12","HEAD"],cwd=clone,text=True).strip()
        run("git","archive","--format=zip","--output="+str(out/"repository_snapshot.zip"),"HEAD",cwd=clone)
        run("git","bundle","create",str(out/"default_branch_history.bundle"),"HEAD",cwd=clone)
        target="lcrdrive:"+item["name"]
        # copy: sem exclusão automática no Drive
        run("rclone","copy",str(clone),target+"/repository","--exclude","/.git/**",
            "--checkers","2","--transfers","2")
        snapshot=target+"/snapshots/"+date+"/"+sha
        run("rclone","copy",str(out),snapshot,"--checkers","2","--transfers","2")
        run("rclone","lsf",snapshot)
        print("BACKUP_OK",item["full"],snapshot,flush=True)

def main():
    owner=os.environ.get("GITHUB_REPOSITORY_OWNER","")
    central=os.environ.get("GITHUB_REPOSITORY","")
    token=os.environ.get("GITHUB_TOKEN","")
    if not all((owner,central,token)):
        print("Faltam variáveis GitHub",file=sys.stderr)
        return 2
    repos=discover(owner,central,token)
    print("Projetos detectados:",*[x["full"] for x in repos],sep="\n - ",flush=True)
    day=datetime.now(timezone.utc).strftime("%Y-%m-%d")
    failed=[]
    for item in repos:
        try:
            backup(item,day)
        except Exception as exc:
            failed.append(item["full"])
            print("BACKUP_FALHOU",item["full"],str(exc),file=sys.stderr)
    return 1 if failed else 0

if __name__=="__main__":
    raise SystemExit(main())
