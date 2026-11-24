# LCR FRAMEWORK — PADRÃO DE DOCUMENTAÇÃO DE ESTRUTURA

## Objetivo

Padronizar a documentação de pastas e componentes para que qualquer pessoa consiga entender a arquitetura, localizar responsabilidades e manter o projeto com segurança.

## 1. README obrigatório por pasta

Toda pasta arquitetural relevante deve possuir README.md. O README deve explicar:

- finalidade da pasta;

- o que pertence e o que não pertence a ela;

- relação com as demais camadas;

- convenções de nomes e exportações;

- como validar alterações.

## 2. Tabela padrão de arquivos

Quando a pasta contém vários arquivos, usar uma tabela com três colunas:

| Arquivo ou pasta | Descrição sucinta | Descrição detalhada |

| --- | --- | --- |

| Nome exato | Papel principal em uma frase | Responsabilidade, entradas, saídas, dependências e observações de manutenção |

Manter nomes exatamente iguais aos arquivos do repositório. Atualizar o README quando arquivos forem adicionados, removidos ou renomeados.

## 3. Limites arquiteturais

- components: estruturas visuais reutilizáveis, sem conteúdo editorial específico do site.

- features: funcionalidades completas e regras específicas do produto; podem compor vários components.

- content: textos, listas, dados editoriais e configuração de conteúdo.

- lib: ferramentas genéricas, resolvers, integrações, tipos utilitários e lógica sem aparência própria.

- app: shell, layout global, bootstrap e rotas da aplicação.

- pages: mapa/espelho navegável e documentação visual das páginas do produto.

- styles: tokens e estilos globais; evitar arquivos soltos sem responsabilidade documentada.

## 4. Componentes reutilizáveis

Cada componente reutilizável deve ter:

- arquivo principal de composição;

- subcomponentes visuais quando necessário;

- arquivo de tipos (*.types.ts) para o contrato público;

- README.md da pasta explicando cada arquivo e o uso esperado;

- exportação clara pelo índice da própria família, quando aplicável.

Exemplo de famílias: components/galleries/logo, people e cards. Dados concretos do Instituto Foton devem permanecer em features ou content, não dentro do componente genérico.

## 5. Rastreabilidade e segurança

Toda mudança estrutural deve:

- preservar referências existentes ou migrá-las explicitamente;

- atualizar READMEs e índices;

- validar formatação, tipos, lint, testes, build e assets;

- ser revisada em pull request antes do merge;

- evitar exclusões até confirmar que não existem consumidores.

## 6. Critério de aceite

Uma pasta está documentada quando:

- seu README permite entender a responsabilidade sem abrir todos os arquivos;

- cada arquivo possui descrição sucinta e detalhada;

- os limites com components/features/content/lib estão claros;

- CI passa e não há referências quebradas.

## 7. Product Structure Mapping

Em produtos com navegação, manter correspondência explícita entre Navigation Menu (rótulos e hierarquia visíveis), Route Map (rotas canônicas e aliases), Page Structure (espelho navegável de pages e referências à implementação) e Asset Structure (recursos agrupados por página ou função). A correspondência é conceitual, não uma obrigação de igualdade física de caminhos.

Manter uma fonte canônica versionada (manifesto ou mapa equivalente, reutilizando o existente), com identificador estável da página, parent_id quando aplicável, ordem de apresentação, chave do rótulo, rota canônica, aliases, caminho da página, referências à implementação e ao catálogo de assets, ou justificativa de não aplicabilidade. Gerar ou validar representações derivadas contra essa fonte; não manter mapas concorrentes. Identificadores não dependem da posição do menu, do idioma nem de nomes transitórios. Preservar convenções técnicas e links existentes durante migrações.

Recursos compartilhados, branding, componentes universais, páginas auxiliares, rotas dinâmicas e conteúdo sem assets próprios podem ter organização própria, com referência ou exceção explícita. Não criar pastas vazias nem duplicar arquivos para forçar simetria. O idioma da interface é independente da nomenclatura técnica.

Critérios PSM-01: IDs únicos, relações válidas e rotas canônicas sem conflitos; PSM-02: itens navegáveis resolvem para rotas e páginas existentes, incluindo aliases aplicáveis; PSM-03: referências à implementação e ao catálogo de assets resolvem com integridade e sem exposição de conteúdo privado; PSM-04: divergências e exceções são documentadas. Integrar verificação automatizada ao Quality Gate existente, com fixtures locais e sem duplicar workflows, conforme LCR_CICD_STANDARD e LCR_TESTING_STANDARD. Registrar evidências por PR/SHA. Projetos sem navegação documentam não aplicabilidade.

[Diagrama vetorial — Product Structure Mapping](assets/ProductStructureMapping.svg)

Versão: 1.1

Escopo: LCR Framework

Aplicação inicial: InstitutoFoton.org
