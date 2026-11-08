# ADR-0007 — Laboratório fotográfico Uncut Gem V1 com inventário mestre em Google Sheets

- **Data:** 2026-11-08 (horário não verificado)
- **Status:** proposto — a prioridade V1/2D e a planilha como inventário mestre foram aprovadas; o mecanismo técnico de leitura de uma planilha privada requer validação operacional.
- **Responsável pela decisão:** responsável humano do NV Quantum Virtual Lab; elaboração técnica: Planner.
- **Decisões relacionadas:** ADR-0001 (estrutura LCR); ADR-0005 (avaliação condicional de ADR); ADR-0006 (backup independente).
- **Confiança:** alta para a necessidade de separar a planilha privada do bundle público; média para o fluxo de sincronização, que depende de permissões e testes reais.
- **Origem da aprovação:** brainstorming acessível do projeto em 08/11/2026: usar **somente Uncut Gem V1**, **2D com fotografias reais**, cadastro mestre no **Google Planilhas**, aba **Inventário** no site; **V2 e 3D adiados**. Não há aprovação explícita para publicar a planilha nem credenciais.

## Problema e contexto

A V0 deve permitir estudar e reconhecer o hardware real Uncut Gem V1 (PCB, módulos, prismas e conexões) e consultar os mesmos 33 itens da aba `Uncut Gem V1` no navegador, com melhor visualização e CSV. É desejável que a planilha seja o registro canônico, mas, em 08/11/2026, a planilha estava **privada** (permissão do proprietário, sem compartilhamento público). GitHub Pages é hospedagem estática; o cliente não pode receber credenciais privadas para ler Sheets.

A V1 e a V2 têm BOMs diferentes, e as fotos/diagramas oficiais não podem ser misturados nem substituídos por montagens fictícias.

## Critérios e restrições

- Preservar a planilha como **fonte canônica editável** e tags V1 estáveis; não criar cadastro concorrente que exija atualização manual dupla.
- Fornecer **V0 estática, sem API paga e sem backend**; manter a estrutura `code/` e normas LCR.
- Não tornar a planilha pública, não introduzir OAuth, tokens ou service accounts em código cliente, não divulgar dados privados sem autorização.
- Consumir imagens **reais oficiais** como evidência física e distinguir diagramas, renders, fotos genéricas e imagens do Drawer (IA).
- Operar sem conectividade com Google Sheets em tempo de execução, com proveniência e indicação de defasagem.
- Não incluir V2 funcional, 3D ou simulação ODMR na V0.

## Alternativas consideradas

| Alternativa viável | Benefícios | Custos, riscos e desvantagens |
|---|---|---|
| A. Inventário escrito diretamente em componentes React | Implementação rápida e totalmente offline | Duplica cadastro e diverge da planilha; contraria a fonte da verdade |
| B. Tornar Google Sheets público e consultar CSV/API diretamente no navegador | Alterações podem refletir sem rebuild | Mudança de permissões **não autorizada**, disponibilidade/CORS e dependência operacional; riscos de publicação involuntária |
| C. **Sheets privado como mestre + snapshot JSON sanitizado e versionado, atualizado via exportação/rotina autorizada no build** | Sem credenciais expostas; página estática, auditável, reprodutível; permite CSV e navegação offline | Não é tempo real; requer importar/sincronizar e conferir versão; exige disciplina de atualização |

## Decisão e justificativa

**Escopo de produto aprovado:** começar pela **V1 fotográfica 2D**, painel de componentes e aba Inventário rica; manter V2 como documentação futura e abandonar a exigência de 3D na V0.

**Estratégia técnica proposta (C):** usar um snapshot público **somente dos campos do inventário autorizados** como leitura da V0, mantendo a planilha privada como registro mestre. Criar importador com validação de cabeçalhos e `Tag única` e opção de ingestão de CSV exportado ou credenciais de leitura restrita somente em ambiente seguro, se autorizadas posteriormente. O site indica a origem e data do snapshot; não declara sincronização ao vivo.

A seleção de C é justificada porque A causa deriva de dados e B exige tornar público um documento atualmente privado sem autorização. A implementação não deve mudar permissões silenciosamente. Este mecanismo permanece **proposto** até ser validado na V0 e aceito pelo responsável.

**Fotografia versus ilustração:** usar imagens reais/arquivos oficiais do hardware V1 para a cena principal; hotspots só onde a posição estiver comprovada; itens sem foto isolada podem ter imagens ilustrativas rotuladas; o fotodiodo BPW34 está no prisma da V1, enquanto `PHOTODIODE1` é conector na placa.

## Consequências e trade-offs

- **Ganhos:** integridade de tags e fontes, segurança da planilha privada, aplicativo estático de baixo custo, transparência da origem, suporte a CSV e futura sincronização sem refazer UX.
- **Perdas:** fotos reais não identificam cada resistor individualmente; parte dos hotspots ficará pendente; snapshots podem ficar desatualizados até nova importação; permissões de imagens externas e direitos de reutilização exigem revisão.
- **Riscos:** erro de mapeamento Sheets/JSON; URLs de `IMAGE()` podem falhar; publicação acidental de dados sensíveis; demonstração de hardware V2 como se fosse V1; documentação própria confundida com a fonte oficial.
- **Mitigações:** validar `UG-V1-...`, cabeçalhos e contagem de 33 registros; rotular foto/render/IA; consultar o `URL da imagem`, não a fórmula; testar exportação e limitar os campos do snapshot.
- **Reversibilidade:** eventual leitura via API ou backend poderá substituir o importador sem refazer a interface; estrutura das tags permanece como contrato. O retorno a dados embutidos não é desejável.
- **Revisão:** reavaliar a estratégia se o responsável autorizar publicação do Sheets ou se a atualização manual se tornar inaceitável.

## Implementação e acompanhamento

1. Codex inspeciona estrutura, fontes oficiais e permissões; implementa a V0 conforme `documentation/prompts/UncutGemV1DevelopmentPrompt.md`.
2. Importar os 33 registros V1 por acesso autorizado ou exportação; se não houver acesso, reportar pendência, sem inventar conteúdo.
3. Implementar zoom 2D, painel lateral retrátil, aba Inventário, CSV e fotos oficiais com proveniência.
4. Validar importação, imagens, controles, testes, build e ausência de segredos. Confirmar status do deploy.
5. Responsável humano valida a adequação do snapshot e decide quando/como habilitar sincronização recorrente; a V2 permanece adiada.

## Evidências e referências

- [Inventário mestre Google Sheets](https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit) — confirmado como privado na consulta de 08/11/2026.
- [Uncut Gem oficial — Quantum Village](https://github.com/QuantumVillage/UncutGem), especialmente `hardware/PCB/README.md`, `hardware/DiamondMount/README.md` e `BuildGuide/BuildGuide.md`.
- [LCR Prompt Generator](../../.agents/skills/lcr-prompt-generator/SKILL.md), [LCR ADR Generator](../../.agents/skills/lcr-adr-generator/SKILL.md), [guardrails](LCR_ADR_GUARDRAILS.md).
- [Zimmermann — How to create ADRs](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html) — referência de estrutura do registro.
- **Escopo de evidências:** apenas conversa acessível e arquivos verificados em GitHub/Drive; não se afirma acesso a outras conversas integrais nem execução do Codex.
