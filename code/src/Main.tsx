import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  fields,
  filterItems,
  exportCsv,
  safeUrl,
  validateSnapshot,
  type Item,
  type Snapshot,
} from "./Inventory";
import "./Styles.css";
const base = import.meta.env.BASE_URL;
const sheet =
  "https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit?gid=1346018179#gid=1346018179";
const official = "https://github.com/QuantumVillage/UncutGem";
function Link({ url, children }: { url: string; children: React.ReactNode }) {
  const safe = safeUrl(url);
  return safe ? (
    <a href={safe} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  ) : null;
}
function Picture({
  url,
  label,
  onOpen,
}: {
  url: string;
  label: string;
  onOpen: (url: string, label: string) => void;
}) {
  const [failed, setFailed] = useState(false);
  const safe = safeUrl(url);
  useEffect(() => setFailed(false), [url]);
  return safe && !failed ? (
    <button
      className="thumbnail"
      onClick={() => onOpen(safe, label)}
      aria-label={`Ampliar imagem: ${label}`}
    >
      <img
        src={safe}
        alt={label}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </button>
  ) : (
    <span className="placeholder">
      {url ? "Imagem indisponível" : "Sem imagem validada"}
    </span>
  );
}
function Dialog({
  title,
  onClose,
  children,
  expanded = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  expanded?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const d = ref.current!;
    d.showModal();
    return () => {
      d.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={expanded ? "expanded" : ""}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <h2>{title}</h2>
        <button onClick={onClose} autoFocus aria-label="Fechar painel">
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
function App() {
  const [tab, setTab] = useState<"explore" | "inventory">(
    location.hash === "#inventario" ? "inventory" : "explore",
  );
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [error, setError] = useState("");
  const [query, setQuery] = useState(""),
    [subsystem, setSubsystem] = useState(""),
    [imageType, setImageType] = useState(""),
    [sort, setSort] = useState("tag");
  const [selected, setSelected] = useState<Item | null>(null),
    [expanded, setExpanded] = useState(false),
    [guide, setGuide] = useState(false);
  const [lightbox, setLightbox] = useState<{
      url: string;
      label: string;
    } | null>(null),
    [lightZoom, setLightZoom] = useState(1);
  const [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [photoFailed, setPhotoFailed] = useState(false);
  const dragging = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);
  useEffect(() => {
    fetch(base + "data/InventoryV1.json")
      .then((r) => {
        if (!r.ok) throw Error("Inventário indisponível");
        return r.json();
      })
      .then(validateSnapshot)
      .then(setSnapshot)
      .catch(() =>
        setError(
          "Não foi possível carregar o inventário. Recarregue a página ou consulte a planilha original.",
        ),
      );
  }, []);
  useEffect(() => {
    const update = () =>
      setTab(location.hash === "#inventario" ? "inventory" : "explore");
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  function navigate(value: "explore" | "inventory") {
    setTab(value);
    location.hash = value === "inventory" ? "inventario" : "explorar";
  }
  function openImage(url: string, label: string) {
    setLightZoom(1);
    setLightbox({ url, label });
  }
  const items = snapshot?.items || [];
  const filtered = filterItems(items, query, subsystem, imageType).sort(
    (a, b) =>
      a[sort as keyof Item].localeCompare(b[sort as keyof Item], "pt-BR", {
        numeric: true,
      }),
  );
  function download(all: boolean) {
    const blob = new Blob([exportCsv(all ? items : filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = all ? "UncutGemV1.csv" : "UncutGemV1Filtrado.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <header>
        <a
          className="brand"
          href="#explorar"
          onClick={() => navigate("explore")}
        >
          <span className="brand-mark">
            N<span>V</span>
          </span>
          <span>
            QUANTUM VIRTUAL LAB
            <small>Um olhar próximo sobre o hardware quântico</small>
          </span>
        </a>
        <span className="version">
          UNCUT GEM <b>V1</b>
        </span>
      </header>
      <nav aria-label="Navegação principal">
        <button
          className={tab === "explore" ? "active" : ""}
          onClick={() => navigate("explore")}
        >
          Explorar V1
        </button>
        <button
          className={tab === "inventory" ? "active" : ""}
          onClick={() => navigate("inventory")}
        >
          Inventário
        </button>
        <span>LABORATÓRIO FOTOGRÁFICO · 2D</span>
      </nav>
      <main>
        <div className="page-heading">
          <div>
            <p className="eyebrow">DA PEÇA AO EXPERIMENTO</p>
            <h1>
              {tab === "explore"
                ? "Conheça o Uncut Gem."
                : "Cada peça, em contexto."}
            </h1>
            <p className="intro">
              {tab === "explore"
                ? "Explore a montagem real de um sensor com diamante NV. Aproxime a imagem e descubra como as partes se conectam."
                : "Consulte os componentes da V1, suas funções e referências de montagem."}
            </p>
          </div>
          <Link url={official + "/blob/main/BuildGuide/BuildGuide.md"}>
            Guia oficial V1
          </Link>
        </div>
        {tab === "explore" ? (
          <>
            <section className="lab-layout">
              <div className="photo-card">
                <div className="photo-bar">
                  <span>
                    <i /> Montagem real · V1
                  </span>
                  <span>Quantum Village</span>
                </div>
                <div
                  className="viewport"
                  aria-label="Fotografia ampliável do Uncut Gem V1"
                  onWheel={(e) =>
                    setZoom((z) =>
                      Math.max(
                        1,
                        Math.min(4, z + (e.deltaY < 0 ? 0.15 : -0.15)),
                      ),
                    )
                  }
                  onPointerDown={(e) => {
                    dragging.current = {
                      x: e.clientX,
                      y: e.clientY,
                      px: pan.x,
                      py: pan.y,
                    };
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    const d = dragging.current;
                    if (d)
                      setPan({
                        x: d.px + e.clientX - d.x,
                        y: d.py + e.clientY - d.y,
                      });
                  }}
                  onPointerUp={() => (dragging.current = null)}
                  onPointerCancel={() => (dragging.current = null)}
                >
                  {photoFailed ? (
                    <p>Fotografia indisponível. Consulte o guia oficial.</p>
                  ) : (
                    <img
                      draggable="false"
                      src={base + "assets/official/DeviceV1.png"}
                      alt="Fotografia oficial da montagem completa Uncut Gem V1, com placa, módulos e conjunto óptico"
                      onError={() => setPhotoFailed(true)}
                      style={{
                        transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
                      }}
                    />
                  )}
                  <div
                    className="zoom-controls"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      aria-label="Diminuir zoom"
                      onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                    >
                      −
                    </button>
                    <output>{Math.round(zoom * 100)}%</output>
                    <button
                      aria-label="Aumentar zoom"
                      onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                      }}
                    >
                      Redefinir
                    </button>
                  </div>
                </div>
                <div className="caption">
                  <span>FOTOGRAFIA OFICIAL</span>
                  <p>
                    Arraste para deslocar · Use a roda do mouse ou os controles
                    para aproximar.
                  </p>
                </div>
              </div>
              <aside className="context-card">
                <p className="eyebrow">UM LABORATÓRIO PARA OBSERVAR</p>
                <h2>O experimento começa nas conexões.</h2>
                <p>
                  Um diamante com centros NV transforma a interação entre luz,
                  micro-ondas e campo magnético em um sinal que pode ser medido.
                </p>
                <ol className="systems">
                  <li>
                    <b>01</b>
                    <div>
                      <strong>Excitar</strong>
                      <span>Laser e geração de micro-ondas</span>
                    </div>
                  </li>
                  <li>
                    <b>02</b>
                    <div>
                      <strong>Detectar</strong>
                      <span>Diamante, filtro vermelho e BPW34</span>
                    </div>
                  </li>
                  <li>
                    <b>03</b>
                    <div>
                      <strong>Ler</strong>
                      <span>Amplificação, ESP32 e OLED</span>
                    </div>
                  </li>
                </ol>
                <button
                  className="primary"
                  onClick={() => navigate("inventory")}
                >
                  Consultar inventário <span>→</span>
                </button>
                <button className="text-button" onClick={() => setGuide(true)}>
                  Como a montagem se organiza ↗
                </button>
                <p className="small-note">
                  Hotspots pendentes: o vínculo entre posição e tag será
                  publicado após importar o inventário e validar a
                  correspondência visual.
                </p>
              </aside>
            </section>
            <section className="note-strip">
              <span>↳</span>
              <p>
                <strong>Olhe para o conjunto óptico.</strong> O BPW34 fica
                encapsulado no prisma, junto ao filtro vermelho. PHOTODIODE1 é o
                conector na placa.
              </p>
              <Link
                url={official + "/blob/main/hardware/DiamondMount/README.md"}
              >
                Entenda o prisma
              </Link>
            </section>
          </>
        ) : (
          <section className="inventory-card">
            <div className="inventory-top">
              <div>
                <h2>Inventário Uncut Gem V1</h2>
                <p>
                  {snapshot?.status === "validated"
                    ? `Snapshot local · ${new Date(snapshot.snapshotAt!).toLocaleString("pt-BR")} · ${items.length} registros`
                    : "Fonte mestre: Google Sheets · snapshot ainda não importado"}
                </p>
              </div>
              <Link url={sheet}>Abrir planilha original</Link>
            </div>
            <div className="filters">
              <label htmlFor="inventory-search">
                Buscar componente
                <input
                  id="inventory-search"
                  type="search"
                  placeholder="Tag, componente, modelo…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label htmlFor="inventory-subsystem">
                Subsistema
                <select
                  aria-label="Subsistema"
                  id="inventory-subsystem"
                  value={subsystem}
                  onChange={(e) => setSubsystem(e.target.value)}
                >
                  <option value="">Todos os subsistemas</option>
                  {[...new Set(items.map((i) => i.subsystem))]
                    .sort()
                    .map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                </select>
              </label>
              <label htmlFor="inventory-image-type">
                Tipo de imagem
                <select
                  aria-label="Tipo de imagem"
                  id="inventory-image-type"
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  {[...new Set(items.map((i) => i.imageType))]
                    .sort()
                    .map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                </select>
              </label>
              <label htmlFor="inventory-sort">
                Ordenar por
                <select
                  aria-label="Ordenar por"
                  id="inventory-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="tag">Tag</option>
                  <option value="name">Componente</option>
                  <option value="subsystem">Subsistema</option>
                </select>
              </label>
            </div>
            <div className="table-toolbar">
              <span aria-live="polite">
                {filtered.length} de {items.length} itens · V1{" "}
                <span className="muted">/ V2 — futura</span>
              </span>
              <div>
                <button disabled={!items.length} onClick={() => download(true)}>
                  Baixar CSV · todos
                </button>
                <button
                  disabled={!filtered.length}
                  onClick={() => download(false)}
                >
                  CSV · filtrados
                </button>
              </div>
            </div>
            {error ? (
              <div className="empty" role="alert">
                <h3>Inventário indisponível</h3>
                <p>{error}</p>
              </div>
            ) : !snapshot ? (
              <div className="empty" role="status">
                Carregando inventário…
              </div>
            ) : snapshot.status === "pending" ? (
              <div className="empty">
                <span className="empty-symbol">▤</span>
                <h3>O inventário aguarda sua primeira importação.</h3>
                <p>
                  Os 33 registros reais da planilha ainda não foram importados.
                  Nenhum dado foi substituído por exemplos.
                </p>
                <Link url={sheet}>Consultar a fonte original</Link>
              </div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Tag",
                        "Imagem",
                        "Componente",
                        "Ref. PCB",
                        "Subsistema",
                        "Qtde",
                        "Modelo / valor",
                        "Função",
                      ].map((x) => (
                        <th key={x} scope="col">
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.tag}>
                        <td>
                          <button
                            className="tag-button"
                            onClick={() => {
                              setSelected(item);
                              setExpanded(false);
                            }}
                          >
                            {item.tag}
                          </button>
                        </td>
                        <td>
                          <Picture
                            url={item.imageUrl}
                            label={item.name}
                            onOpen={openImage}
                          />
                          <small>
                            {item.imageType || "Sem procedência validada"}
                          </small>
                        </td>
                        <td>
                          <button
                            className="name-button"
                            onClick={() => setSelected(item)}
                          >
                            {item.name}
                          </button>
                        </td>
                        <td>{item.pcb || "—"}</td>
                        <td>{item.subsystem}</td>
                        <td>{item.quantity || "—"}</td>
                        <td>{item.model || "—"}</td>
                        <td>{item.function}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && (
                  <div className="empty">
                    Nenhum componente corresponde aos filtros.
                  </div>
                )}
              </div>
            )}
          </section>
        )}
        <p className="safety">
          <strong>Cuidados de montagem</strong> Evite exposição ocular ao laser
          e reflexos. Confira curtos, alimentação e pinagem antes de energizar,
          especialmente OLED e variante/tensão do TL082. Material didático; não
          é protocolo certificado.
        </p>
      </main>
      <footer>
        <span>
          NV Quantum Virtual Lab{" "}
          <small>Estudo independente · Hardware por Quantum Village</small>
        </span>
        <div>
          <Link url={official}>Fontes oficiais</Link>
          <Link url={sheet}>Planilha</Link>
          <Link url="https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab">
            Código-fonte
          </Link>
          <a href={base + "assets/licenses/UncutGemLicense.txt"}>
            Licença das imagens · AGPL-3.0
          </a>
        </div>
      </footer>
      {selected && (
        <Dialog
          title={selected.name}
          onClose={() => setSelected(null)}
          expanded={expanded}
        >
          <button
            className="text-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Reduzir ficha" : "Expandir ficha"}
          </button>
          <p className="eyebrow">{selected.tag} · NÃO LOCALIZADO VISUALMENTE</p>
          <Picture
            url={selected.imageUrl}
            label={selected.name}
            onOpen={openImage}
          />
          <p className="provenance">
            {selected.imageType || "Sem procedência validada"}
          </p>
          <dl>
            {(Object.keys(fields) as (keyof Item)[])
              .filter(
                (key) =>
                  !["imageUrl", "source", "datasheet", "name"].includes(key),
              )
              .map((key) => (
                <React.Fragment key={key}>
                  <dt>{fields[key]}</dt>
                  <dd>{selected[key] || "Não documentado"}</dd>
                </React.Fragment>
              ))}
          </dl>
          <div className="source-links">
            <Link url={selected.imageUrl}>Imagem original</Link>
            <Link url={selected.source}>Fonte técnica</Link>
            <Link url={selected.datasheet}>Datasheet</Link>
          </div>
          <p className="small-note">
            Preços são referências históricas, não cotações atuais.
          </p>
        </Dialog>
      )}
      {guide && (
        <Dialog
          title="Orientação de montagem V1"
          onClose={() => setGuide(false)}
          expanded
        >
          <p>
            Resumo de leitura do guia oficial. Consulte os esquemáticos e
            footprints antes de soldar.
          </p>
          <ol className="guide-list">
            <li>
              <h3>Placa, soquetes e alimentação</h3>
              <p>
                Confira TL082, resistores e capacitores; monte os soquetes.
                Valide a alimentação e procure curtos antes de instalar todos os
                módulos.
              </p>
            </li>
            <li>
              <h3>ESP32, RF e conexões</h3>
              <p>
                O guia instala o ADF4351 no verso e o amplificador RF na frente.
                O cabo SMA conecta os módulos; confira polaridade do laser.
              </p>
            </li>
            <li>
              <h3>Prisma óptico em três camadas</h3>
              <p>
                Diamante e antena em cobre esmaltado, nova camada de resina,
                filtro vermelho e BPW34 encapsulado. Diagramas oficiais, fora de
                escala.
              </p>
              <div className="layers">
                {[1, 2, 3].map((n) => (
                  <figure key={n}>
                    <button
                      onClick={() =>
                        openImage(
                          base + `assets/official/Layer${n}.png`,
                          `Diagrama oficial · camada ${n}`,
                        )
                      }
                    >
                      <img
                        src={base + `assets/official/Layer${n}.png`}
                        alt={`Diagrama oficial da camada ${n} do prisma`}
                      />
                    </button>
                    <figcaption>DIAGRAMA OFICIAL · CAMADA {n}</figcaption>
                  </figure>
                ))}
              </div>
            </li>
            <li>
              <h3>OLED e testes iniciais</h3>
              <p>
                Confira a ordem VDD/GND e todas as conexões. O guia descreve a
                mensagem de calibração e testes de resposta ao ímã.
              </p>
            </li>
          </ol>
          <Link url={official + "/blob/main/BuildGuide/BuildGuide.md"}>
            Ler o guia completo
          </Link>
        </Dialog>
      )}
      {lightbox && (
        <Dialog
          title={lightbox.label}
          onClose={() => setLightbox(null)}
          expanded
        >
          <div className="lightbox-controls">
            <button
              onClick={() => setLightZoom((z) => Math.max(1, z - 0.25))}
              aria-label="Reduzir imagem"
            >
              −
            </button>
            <span>{Math.round(lightZoom * 100)}%</span>
            <button
              onClick={() => setLightZoom((z) => Math.min(4, z + 0.25))}
              aria-label="Ampliar imagem"
            >
              +
            </button>
            <button onClick={() => setLightZoom(1)}>Redefinir</button>
          </div>
          <div className="lightbox-image">
            <img
              src={lightbox.url}
              alt={lightbox.label}
              style={{ width: `${lightZoom * 100}%` }}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
