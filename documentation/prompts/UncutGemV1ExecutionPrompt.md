# DevelopmentPrompt — Execução da V0 fotográfica Uncut Gem V1

## Identificação
- Tipo: desenvolvimento inicial.
- Destinatário: Codex.
- Projeto: https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab
- Data/hora: consultar o relógio de execução; não inferir do anexo.
- Origem: pedido explícito do usuário nesta conversa para elaborar o prompt, modificar/criar arquivos no GitHub e entregar um site testável. O documento anexado é uma especificação de referência; suas afirmações de acesso, aprovação e status devem ser verificadas.

## Objetivo e resultado esperado
Implementar uma aplicação estática React + TypeScript + Vite em code/ para explorar a fotografia oficial V1 e consultar exclusivamente o inventário V1 real da planilha privada.

## Escopo aprovado
1. Explorar V1 com fotografia oficial, zoom/pan e orientação referenciada da montagem.
2. Inventário com busca, filtros, ordenação, ficha acessível, lightbox e CSV seguro.
3. Importador CSV com validação de cabeçalhos, 33 tags únicas e proveniência; nenhuma credencial no cliente. A planilha continua mestre.
4. Build/testes e workflow de publicação Pages, condicionado a dados reais autorizados e acesso da plataforma.

## Referências e arquivos reais
Consultar AGENTS.md, documentation/LCR_GUARDRAILS.md, documentation/LCR_NAMING_CONVENTIONS.md, documentation/LCR_WORKFLOW.md, documentation/LCR_START.md e documentation/decision-archive/LCR_ADR_GUARDRAILS.md.
Referências verificadas: documentation/prompts/UncutGemV1DevelopmentPrompt.md e documentation/decision-archive/ADR-0007-laboratorio-fotografico-v1-inventario-sheets.md.
Especificação complementar fornecida: UncutGemV1DevelopmentPrompt.md. Não substituir os 33 registros privados por conteúdo extraído de outra BOM.

## Guardrails e limites
Preservar LCR, documento histórico e links dos assets existentes. Sem V2 funcional, 3D, simulação, chat, APIs pagas, backend ou alteração da privacidade da planilha. Distinguir fotografia, diagrama, render e IA. BPW34 no prisma; PHOTODIODE1 é conector. Nenhum hotspot sem posição e tag verificadas. Publicação completa depende de inventário real autorizado; não declarar sincronização ao vivo.

## Plano de implementação
Inspecionar e atualizar checkout sem sobrescrever alterações; conferir ADR e fontes oficiais. Criar contrato/importador antes de consumir dados. Implementar UI e estado explícito de importação pendente. Testar CSV, validação, filtros, navegação, zoom, build e regras LCR. Salvar workflow Pages com bloqueio de publicação sem snapshot validado. Atualizar README e relatório com resultados reais. Commit/push das mudanças autorizadas; verificar site apenas se publicação for possível.

## Critérios de aceite e evidências
Aplicar os critérios da especificação de referência. Separar funcionalidades implementadas, testadas com fixtures sintéticas e validadas com dados reais. O inventário de 33 itens e hotspots permanecem pendentes até acesso legítimo à exportação. Testar teclado e mobile com navegador quando disponível. Registrar falhas preexistentes de nomenclatura sem escondê-las. Relatar commit, arquivos, comandos, pendências e URL pública somente após verificação.

## Entrega e ADR
ADR avaliado com lcr-adr-generator: não necessário — o ADR-0007 já cobre a estratégia de fotografia V1 e snapshot privado → público; referenciá-lo sem duplicar. A solicitação atual autoriza implementação; não comprova leitura da planilha nem importação. Preservar o status histórico do ADR e registrar a evidência operacional separadamente.
