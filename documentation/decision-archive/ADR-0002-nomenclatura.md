# ADR-0002 — Convenções simples e auditoria recorrente de nomenclatura
- **Data:** 2026-11-07
- **Status:** aprovado
- **Decisor:** responsável humano pelo projeto

## Contexto
Adotar regras distintas para cada extensão eleva a carga cognitiva e aumenta a chance de não seguir o protocolo.

## Alternativas
1. Convenções nativas de cada ferramenta para todos os arquivos.
2. PascalCase universal sem exceções.
3. Três convenções principais e exceções técnicas justificadas.

## Decisão
Pastas: kebab-case. Documentos/workflows institucionais: UPPER_SNAKE_CASE. Arquivos personalizados em geral: PascalCase. Python: módulos/scripts em snake_case, conforme PEP 8. Nomes reservados de ferramentas e registros possuem exceções explícitas.

Qualquer especialista pode solicitar `LCR_NAMING`. O verificador é executado no `LCR_START`, no fechamento de `LCR_DAY` quando houver ferramentas, e em GitHub Actions recorrente.

## Consequências
Regra fácil de memorizar e CI objetivo; exceções são mantidas no documento e no código do verificador. A verificação nunca renomeia automaticamente arquivos existentes.

## Referências
`LCR_NAMING_CONVENTIONS.md`, `LCR_GUARDRAILS.md`, `code/scripts/lcr_naming.py`.
