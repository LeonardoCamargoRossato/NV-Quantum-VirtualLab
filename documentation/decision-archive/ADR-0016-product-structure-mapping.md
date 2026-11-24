# ADR-0016 — Product Structure Mapping

- Data: 2026-11-24
- Status: aprovado (política documental); implementação por projeto pendente.
- Responsável: responsável humano do LCR Framework.
- Decisões relacionadas: ADR-0002, ADR-0014 e ADR-0015.

## Contexto
A auditoria do Instituto Foton identificou hierarquias de assets por formato e por página coexistindo e a necessidade de localizar rotas, páginas, implementações e recursos a partir da navegação. O responsável aprovou a correspondência conceitual entre essas camadas e a validação no CI existente.

## Alternativas consideradas
| Alternativa | Ganhos | Limitações |
| --- | --- | --- |
| Diretórios rigidamente idênticos | Simetria visual | Duplica recursos e acopla código à ordem do menu |
| Mapas independentes mantidos manualmente | Flexibilidade | Divergência e retrabalho |
| Manifesto canônico e correspondência conceitual | Rastreabilidade, flexibilidade e validação | Exige contratos e manutenção do mapa |

## Decisão
Adotar a terceira alternativa. O Product Structure Mapping relaciona Navigation Menu, Route Map, Page Structure e Asset Structure por identificadores estáveis. Reutilizar manifesto ou catálogo existente; não criar fontes concorrentes, pastas vazias nem duplicar assets por simetria. Recursos compartilhados, rotas auxiliares/dinâmicas e exceções justificadas são permitidos. A ordem e o idioma da interface não determinam a identidade técnica. Preservar aliases e referências durante migrações. O Quality Gate existente verifica PSM-01 a PSM-04 (CI-06), com testes isolados e sem novos workflows redundantes; registrar não aplicabilidade quando não houver navegação.

## Consequências e riscos
Melhora a navegação humana e a manutenção; requer validação de consistência, integração gradual e documentação das exceções. Não autoriza exclusão de originais, alteração automática de URLs, provisionamento de serviços ou internacionalização antecipada.

## Referências e aceite
- LCR_FRAMEWORK_DOCUMENTATION_STANDARD, versão 1.1, seção 7.
- LCR_ASSET_ORGANIZATION_STANDARD, versão 1.2.
- LCR_CICD_STANDARD, versão 1.2, CI-06.
- LCR_TESTING_STANDARD.
- ProductStructureMapping.svg.
- Aprovação humana em 24/11/2026. A adoção inicial no Foton depende de PR, Quality Gate, evidências por SHA e validação de rotas/assets; a aprovação documental não comprova implementação.
