# Uncut Gem V1 — Árvore de Subsistemas e Componentes

> Artefato do Planner · Data de registro: 2026-11-09 · Status: estrutura informacional aprovada para planejamento, identificação visual pendente.

## Identificação

- Projeto: **NV Quantum Virtual Lab**.
- Revisão estudada: **Uncut Gem V1** (não confundir com V2).
- **Camada A:** subsistemas (10 registros; categoria `subsistema`, `Pertence a = Sistema V1`).
- **Camada B:** componentes / pontos físicos associados (69 registros; categoria `componente`, `Pertence a = subsistema da Camada A`).
- **Camada C:** adiada; nenhum mapeamento de terceiro nível implementado.
- Planilha-mestre: https://docs.google.com/spreadsheets/d/158OGccBdF5Hf6qdWIH2-Tmt_-gU8sO8pz3CvyTpycXU/edit
- Aba: `Árvore Uncut Gem V1 — System Components` (segunda aba, `gid=2026110901`).
- Origem dos dados: árvore aceita na conversa e materiais públicos de montagem/PCB do projeto Quantum Village; reutilização seletiva de tags e imagens da aba `Uncut Gem V1`.

## Contrato da tabela

Colunas em ordem: `Tag única`, `Imagem`, `Componente / Subsistema`, `Categoria`, `Pertence a`, `Ref. PCB`, `Subsistema`, `Qtde`, `Modelo / valor`, `Função / descrição`, `Localização / montagem`, `Preço BR (referência histórica)`, `Tipo de imagem`, `URL da imagem`, `Fonte técnica`, `Datasheet`, `Pendências / compatibilidade`, `Tag inventário V1`.

**Identificadores**: tags `UG-V1-Sxx` designam subsistemas; tags `UG-V1-00xx` são referências diretas ao inventário existente; tags `UG-V1-Bxxx` são entradas detalhadas novas. Quando uma entrada detalha um grupo da aba original (ex.: R1, R2, R3), o campo `Tag inventário V1` preserva o vínculo ao grupo. **Não reindexar as tags após a publicação.**

## Árvore hierárquica completa

### UG-V1-S01 · Alimentação elétrica

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Recebe alimentação protegida de 5 V e distribui energia aos módulos; incluir filtragem.
- **Localização:** PCB e alimentação externa
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto; não recorte da fonte)
- **Componentes cadastrados:** 9

- **UG-V1-0031 — Fonte de alimentação protegida** · Ref.: `PWR` · Modelo: USB 5 V protegido
  - Função: Alimenta placa e módulos.
  - Local: 5V_SUPP1/USB · Pendências: Opção ilustrativa: power bank USB 5 V ou fonte de bancada 5 V com limite de corrente/proteção. Confirmar tensão, capacidade e proteção antes do uso; não ligar diretamente ao notebook durante testes iniciais.
  - Tag de origem no inventário V1: `UG-V1-0031`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1PowerBankUsbIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://commons.wikimedia.org/wiki/File:USB_power_bank.jpg — Domínio público
- **UG-V1-0013 — Conector 5 V** · Ref.: `5V_SUPP1` · Modelo: 2×3
  - Função: Distribui alimentação 5 V/GND.
  - Local: PCB V1
  - Tag de origem no inventário V1: `UG-V1-0013`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render de placa, não foto do conector)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B001 — Conector USB do ESP32** · Ref.: `USB-ESP`
  - Função: Entrada USB para energização e programação; conferir circuito e conexão utilizados.
  - Local: Módulo ESP32, próximo aos botões EN/BOOT
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto; não foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **UG-V1-B002 — Capacitor C5** · Ref.: `C5` · Modelo: 100 nF
  - Função: Desacoplamento / filtragem de alimentação; conforme BOM, 100 nF.
  - Local: Região de alimentação da PCB · Pendências: Valor documentado; hotspot e posição exata devem ser conferidos no KiCad.
  - Tag de origem no inventário V1: `UG-V1-0011`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B003 — Capacitor C6** · Ref.: `C6` · Modelo: 100 nF
  - Função: Desacoplamento / filtragem de alimentação; conforme BOM, 100 nF.
  - Local: Região de alimentação da PCB · Pendências: Valor documentado; hotspot e posição exata devem ser conferidos no KiCad.
  - Tag de origem no inventário V1: `UG-V1-0011`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B004 — Capacitor C7** · Ref.: `C7` · Modelo: 100 nF
  - Função: Desacoplamento / filtragem de alimentação; conforme BOM, 100 nF.
  - Local: Região de alimentação da PCB · Pendências: Valor documentado; hotspot e posição exata devem ser conferidos no KiCad.
  - Tag de origem no inventário V1: `UG-V1-0011`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B005 — Capacitor C8** · Ref.: `C8` · Modelo: 100 nF
  - Função: Desacoplamento / filtragem de alimentação; conforme BOM, 100 nF.
  - Local: Região de alimentação da PCB · Pendências: Valor documentado; hotspot e posição exata devem ser conferidos no KiCad.
  - Tag de origem no inventário V1: `UG-V1-0011`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B006 — Capacitor C9** · Ref.: `C9` · Modelo: 10 µF
  - Função: Filtragem de alimentação; conforme BOM, 10 µF.
  - Local: Região de alimentação da PCB · Pendências: Valor documentado; hotspot e posição exata devem ser conferidos no KiCad.
  - Tag de origem no inventário V1: `UG-V1-0012`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorEletroliticoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B007 — Capacitor C10** · Ref.: `C10` · Modelo: 10 µF
  - Função: Filtragem de alimentação; conforme BOM, 10 µF.
  - Local: Região de alimentação da PCB · Pendências: Valor documentado; hotspot e posição exata devem ser conferidos no KiCad.
  - Tag de origem no inventário V1: `UG-V1-0012`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorEletroliticoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md

### UG-V1-S02 · Controle e aquisição — ESP32

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Coordena a varredura de RF, a conversão analógico-digital do sinal recebido e o OLED.
- **Localização:** Face frontal, parte inferior esquerda
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto; não recorte individual)
- **Componentes cadastrados:** 8

- **UG-V1-0004 — ESP32 DOIT DevKit V1** · Ref.: `U1` · Modelo: 38 pinos (2×19)
  - Função: Controla PLL, lê ADC e atualiza OLED.
  - Local: Módulo encaixado na PCB · Pendências: Checar pinagem/footprint.
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, não peça isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B008 — Módulo metálico ESP32** · Ref.: `ESP-SHIELD`
  - Função: Blindagem do conjunto ESP-WROOM; não confundir com outro ESP32 separado.
  - Local: Sobre o DevKit
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto, não peça individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B009 — Botão EN** · Ref.: `ESP-EN`
  - Função: Reinicialização/enable na placa de desenvolvimento.
  - Local: Próximo à entrada USB
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto, não peça individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B010 — Botão BOOT** · Ref.: `ESP-BOOT`
  - Função: Controle do modo de inicialização/gravação.
  - Local: Próximo à entrada USB
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto, não peça individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B011 — LEDs do DevKit** · Ref.: `ESP-LED`
  - Função: Indicadores de alimentação/estado conforme versão comercial.
  - Local: Placa ESP32
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto, não peça individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B012 — Fileiras de pinos / headers** · Ref.: `ESP-HEADER`
  - Função: Interface elétrica entre DevKit e PCB principal.
  - Local: Laterais do módulo ESP32
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto, não peça individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B013 — Conversor USB–serial** · Ref.: `ESP-UART`
  - Função: Interface USB–UART da placa; modelo exato depende do DevKit e deve ser identificado.
  - Local: Placa de desenvolvimento · Pendências: Identificar chip exato na foto da revisão.
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto, não peça individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B014 — ADC interno do ESP32** · Ref.: `ESP-ADC`
  - Função: Função de conversão analógico-digital do microcontrolador, não componente externo visível.
  - Local: Interno ao microcontrolador: não criar hotspot independente · Pendências: Não deve receber retângulo físico separado.
  - Tag de origem no inventário V1: `UG-V1-0004`
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md

### UG-V1-S03 · Excitação óptica — laser

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Emite luz verde de aproximadamente 520–532 nm para excitar os centros NV do diamante.
- **Localização:** Face frontal, parte superior esquerda
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto)
- **Componentes cadastrados:** 4

- **UG-V1-0022 — Laser verde** · Ref.: `LASER` · Modelo: 520–532 nm
  - Função: Excita opticamente centros NV.
  - Local: Apontado ao diamante · Pendências: Confirmar potência, tensão e segurança.
  - Tag de origem no inventário V1: `UG-V1-0022`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, não módulo isolado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B015 — Driver / placa do laser** · Ref.: `LASER-DRV`
  - Função: Eletrônica junto ao módulo cilíndrico; identificar o circuito exato antes de especificar pinos.
  - Local: Região superior esquerda · Pendências: Identificação visual a conferir; não extrapolar especificações não publicadas.
  - Tag de origem no inventário V1: `UG-V1-0022`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B016 — Fios de alimentação do laser** · Ref.: `LASER-WIRE`
  - Função: Conduzem energia ao módulo laser verde.
  - Local: Região superior esquerda · Pendências: Identificação visual a conferir; não extrapolar especificações não publicadas.
  - Tag de origem no inventário V1: `UG-V1-0022`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B017 — Suporte e alinhamento do laser** · Ref.: `LASER-HOLD`
  - Função: Mantém o feixe direcionado ao diamante sem exposição ocular.
  - Local: Região superior esquerda · Pendências: Identificação visual a conferir; não extrapolar especificações não publicadas.
  - Tag de origem no inventário V1: `UG-V1-0022`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia do conjunto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md

### UG-V1-S04 · Geração de micro-ondas — ADF4351

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Sintetiza as frequências de micro-ondas sob comandos do ESP32.
- **Localização:** Módulo no verso da PCB
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render oficial da PCB; não foto do módulo isolado)
- **Componentes cadastrados:** 5

- **UG-V1-0018 — Placa geradora RF ADF4351** · Ref.: `RF-ADF` · Modelo: Módulo ADF4351 (SPI exposto)
  - Função: Sintetiza varredura MW perto de 2,87 GHz.
  - Local: Encaixe posterior da PCB · Pendências: Verificar DAT/CLK/CE/LE e tensão.
  - Tag de origem no inventário V1: `UG-V1-0018`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, não módulo isolado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-0017 — Conector gerador RF** · Ref.: `SIGGEN1` · Modelo: 2×5
  - Função: Encaixe do ADF4351; instalado no verso.
  - Local: PCB V1
  - Tag de origem no inventário V1: `UG-V1-0017`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render de placa, não foto do conector)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B018 — Circuito sintetizador ADF4351** · Ref.: `ADF-IC`
  - Função: Circuito PLL/frequência que gera o sinal de micro-ondas.
  - Local: Verso da PCB, módulo ADF4351 · Pendências: Módulo no verso; geometria e hotspot dependem de imagem oficial compatível.
  - Tag de origem no inventário V1: `UG-V1-0018`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render da face traseira; não fotografia isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B019 — Pinos de comando SPI/LE** · Ref.: `ADF-SPI`
  - Função: DAT, CLK, CE, LE e referências de alimentação; verificar esquemático.
  - Local: Verso da PCB, módulo ADF4351 · Pendências: Módulo no verso; geometria e hotspot dependem de imagem oficial compatível.
  - Tag de origem no inventário V1: `UG-V1-0018`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render da face traseira; não fotografia isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md
- **UG-V1-B020 — Saída RF do ADF4351** · Ref.: `ADF-SMA`
  - Função: Conector de RF para cabo SMA no módulo do verso.
  - Local: Verso da PCB, módulo ADF4351 · Pendências: Módulo no verso; geometria e hotspot dependem de imagem oficial compatível.
  - Tag de origem no inventário V1: `UG-V1-0018`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render da face traseira; não fotografia isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md

### UG-V1-S05 · Amplificação de micro-ondas

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Amplifica o sinal de RF gerado pelo ADF4351 antes de chegar à antena.
- **Localização:** Face frontal, região direita
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto)
- **Componentes cadastrados:** 6

- **UG-V1-0019 — Amplificador RF 40 dB** · Ref.: `RF-AMP` · Modelo: 30–4000 MHz (nominal)
  - Função: Aumenta amplitude da MW para a antena.
  - Local: Frente da PCB · Pendências: Verificar ganho real a 2,87 GHz.
  - Tag de origem no inventário V1: `UG-V1-0019`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, não módulo isolado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B021 — Circuito ativo do amplificador RF** · Ref.: `RF-IC`
  - Função: Componente semicondutor do módulo amplificador; modelo exato não confirmado.
  - Local: Módulo frontal, região direita · Pendências: Sem especificação individual confirmada dos componentes comerciais.
  - Tag de origem no inventário V1: `UG-V1-0019`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, sem recorte dedicado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B022 — Conector SMA de entrada RF** · Ref.: `RF-SMAIN`
  - Função: Recebe sinal de micro-ondas vindo do ADF4351.
  - Local: Módulo frontal, região direita · Pendências: Sem especificação individual confirmada dos componentes comerciais.
  - Tag de origem no inventário V1: `UG-V1-0019`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, sem recorte dedicado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B023 — Conector SMA de saída RF** · Ref.: `RF-SMAOUT`
  - Função: Envia micro-ondas amplificadas à antena.
  - Local: Módulo frontal, região direita · Pendências: Sem especificação individual confirmada dos componentes comerciais.
  - Tag de origem no inventário V1: `UG-V1-0019`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, sem recorte dedicado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B024 — Fios de alimentação do módulo RF** · Ref.: `RF-WIRE`
  - Função: Alimentação elétrica do amplificador comercial.
  - Local: Módulo frontal, região direita · Pendências: Sem especificação individual confirmada dos componentes comerciais.
  - Tag de origem no inventário V1: `UG-V1-0019`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, sem recorte dedicado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B025 — Componentes SMD do módulo RF** · Ref.: `RF-SMD`
  - Função: Passivos de RF visíveis no módulo; valores só após BOM/datasheet do módulo.
  - Local: Módulo frontal, região direita · Pendências: Sem especificação individual confirmada dos componentes comerciais.
  - Tag de origem no inventário V1: `UG-V1-0019`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto, sem recorte dedicado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md

### UG-V1-S06 · Conexões RF e antena

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Conecta gerador, amplificador e antena, transportando energia de micro-ondas por cabo coaxial e fio de cobre.
- **Localização:** Região direita e prisma
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto)
- **Componentes cadastrados:** 4

- **UG-V1-0020 — Cabo SMA curto** · Ref.: `RF-SMA` · Modelo: Coaxial com conectores SMA
  - Função: Liga gerador ADF4351 e amplificador RF.
  - Local: Entre módulos RF
  - Tag de origem no inventário V1: `UG-V1-0020`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **UG-V1-0021 — Antena em laço** · Ref.: `ANT` · Modelo: Cobre esmaltado 24 AWG
  - Função: Acopla campo MW ao diamante.
  - Local: [object Object]
  - Tag de origem no inventário V1: `UG-V1-0021`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer1.png (Diagrama oficial (não foto isolada))
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-B026 — Adaptadores e terminais SMA** · Ref.: `SMA-ADAPTER`
  - Função: Peças de união dos cabos e módulos RF.
  - Local: Região direita do conjunto
  - Tag de origem no inventário V1: `UG-V1-0020`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto real do conjunto; ligação exata a verificar)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **UG-V1-B027 — Ligação do amplificador à antena** · Ref.: `SMA-TO-ANT`
  - Função: Junção RF de saída ao laço de cobre; a ligação pode ser SMA ou soldada conforme montagem.
  - Local: Entre amplificador e prisma
  - Tag de origem no inventário V1: `UG-V1-0020`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto real do conjunto; ligação exata a verificar)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md

### UG-V1-S07 · Prisma e detecção óptica

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Reúne diamante NV, filtro vermelho e BPW34 no conjunto encapsulado com resina.
- **Localização:** Face frontal, região superior
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer3.png (Diagrama oficial do interior do prisma; não fotografia)
- **Componentes cadastrados:** 8

- **UG-V1-0023 — Conjunto do prisma NV** · Ref.: `PRISMA` · Modelo: Três camadas de resina UV
  - Função: Posiciona diamante, filtro, antena e fotodiodo.
  - Local: Próximo ao laser
  - Tag de origem no inventário V1: `UG-V1-0023`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto da montagem V1)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-0024 — Diamante com centros NV** · Ref.: `DIAM-NV` · Modelo: ≈750 µm na montagem original
  - Função: Material quântico sensível ao campo magnético.
  - Local: Centro do laço de cobre · Pendências: Aquisição especializada; não é diamante comum.
  - Tag de origem no inventário V1: `UG-V1-0024`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer1.png (Diagrama oficial, não foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-0027 — Filtro gel vermelho** · Ref.: `FILTRO` · Modelo: Quadrado ≈ 5×5 mm
  - Função: Reduz luz verde recebida pelo detector.
  - Local: Entre NV e fotodiodo
  - Tag de origem no inventário V1: `UG-V1-0027`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer3.png (Diagrama oficial, não foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-0028 — Fotodiodo BPW34** · Ref.: `BPW34` · Modelo: BPW34; área ativa ≈3×3 mm
  - Função: Converte fluorescência recebida em fotocorrente.
  - Local: Dentro do prisma, ligado ao PHOTODIODE1
  - Tag de origem no inventário V1: `UG-V1-0028`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer3.png (Diagrama oficial, não foto individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-0025 — Resina transparente UV** · Ref.: `EPOXY` · Modelo: Epóxi com cura UV
  - Função: Fixa o cristal e demais elementos do prisma.
  - Local: Três camadas
  - Tag de origem no inventário V1: `UG-V1-0025`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer2.png (Diagrama oficial, não foto do produto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-0026 — Molde de silicone** · Ref.: `MOLDE` · Modelo: 10–20 mm (referência)
  - Função: Forma o bloco de resina.
  - Local: Durante fabricação
  - Tag de origem no inventário V1: `UG-V1-0026`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer1.png (Diagrama oficial, não foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- **UG-V1-0016 — Conector do fotodiodo** · Ref.: `PHOTODIODE1` · Modelo: 1×3
  - Função: Liga BPW34 do prisma à placa; não é o fotodiodo.
  - Local: PCB V1
  - Tag de origem no inventário V1: `UG-V1-0016`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render de placa, não foto do conector)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B028 — Fios de saída do BPW34** · Ref.: `PRISMA-WIRE`
  - Função: Conectam o fotodiodo encapsulado ao PHOTODIODE1 da PCB.
  - Local: Do prisma para a placa
  - Tag de origem no inventário V1: `UG-V1-0028`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/DiamondMount/images/layer3.png (Diagrama oficial do prisma)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md

### UG-V1-S08 · Condicionamento eletrônico de sinal

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Região analógica TL082 com resistores, capacitores e pontos de medição; condiciona sinal do fotodiodo.
- **Localização:** Face frontal, imediatamente acima do ESP32
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto; requer recorte de detalhe)
- **Componentes cadastrados:** 11

- **UG-V1-0005 — TL082 amplificador operacional** · Ref.: `U2` · Modelo: TL082; DIP/variante a confirmar
  - Função: Amplificação/condicionamento da saída do fotodiodo.
  - Local: Seção TIA da PCB · Pendências: Checar se a versão aceita alimentação utilizada.
  - Tag de origem no inventário V1: `UG-V1-0005`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png (Render da PCB, não foto individual)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-0015 — Ponto de osciloscópio** · Ref.: `OScope1` · Modelo: OScope
  - Função: Acesso ao sinal para medição.
  - Local: PCB V1
  - Tag de origem no inventário V1: `UG-V1-0015`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render de placa, não foto do conector)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B029 — R1 — Resistor** · Ref.: `R1` · Modelo: 1 kΩ
  - Função: Resistor do condicionamento analógico do BPW34; função exata no esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0006`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1ResistorAxialIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B030 — R2 — Resistor** · Ref.: `R2` · Modelo: 1 kΩ
  - Função: Resistor do condicionamento analógico do BPW34; função exata no esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0006`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1ResistorAxialIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B031 — R3 — Resistor** · Ref.: `R3` · Modelo: 1 kΩ
  - Função: Resistor do condicionamento analógico do BPW34; função exata no esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0006`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1ResistorAxialIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B032 — R4 — Resistor** · Ref.: `R4` · Modelo: 1 MΩ
  - Função: Resistor do condicionamento analógico do BPW34; função exata no esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0007`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1ResistorAxialIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B033 — R5 — Resistor** · Ref.: `R5` · Modelo: 47 kΩ
  - Função: Resistor do condicionamento analógico do BPW34; função exata no esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0008`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1ResistorAxialIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B034 — C1 — Capacitor** · Ref.: `C1` · Modelo: Código 104; valor a confirmar no KiCad
  - Função: Componente associado ao estágio de amplificação/integração conforme esquema.
  - Local: Região analógica acima do ESP32 · Pendências: O README informa modo integrador para C1/C2; código da BOM não confirma valor automaticamente.
  - Tag de origem no inventário V1: `UG-V1-0009`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B035 — C2 — Capacitor** · Ref.: `C2` · Modelo: Código 33; valor a confirmar no KiCad
  - Função: Componente associado ao estágio de amplificação/integração conforme esquema.
  - Local: Região analógica acima do ESP32 · Pendências: O README informa modo integrador para C1/C2; código da BOM não confirma valor automaticamente.
  - Tag de origem no inventário V1: `UG-V1-0010`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B036 — C3 — Capacitor** · Ref.: `C3` · Modelo: 100 nF
  - Função: Componente associado ao estágio de amplificação/integração conforme esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0011`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B037 — C4 — Capacitor** · Ref.: `C4` · Modelo: 100 nF
  - Função: Componente associado ao estágio de amplificação/integração conforme esquema.
  - Local: Região analógica acima do ESP32 · Pendências: Hotspot físico requer identificação por serigrafia/KiCad.
  - Tag de origem no inventário V1: `UG-V1-0011`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1CapacitorCeramicoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md

### UG-V1-S09 · Visualização — OLED

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** Apresenta informações e leituras do sensor em display I²C.
- **Localização:** Face frontal, parte inferior direita
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real do conjunto)
- **Componentes cadastrados:** 5

- **UG-V1-0030 — Display OLED** · Ref.: `OLED` · Modelo: 1,3 pol. SH110X 128×64, I²C 0x3C
  - Função: Exibe calibração e traçados ADC/ODMR.
  - Local: Conector OLED na PCB · Pendências: Seu OLED pessoal ainda não foi verificado.
  - Tag de origem no inventário V1: `UG-V1-0030`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto da montagem, não visor isolado)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-0014 — Conector OLED** · Ref.: `J2` · Modelo: Interface I²C
  - Função: Conecta display.
  - Local: PCB V1
  - Tag de origem no inventário V1: `UG-V1-0014`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render de placa, não foto do conector)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B038 — Painel emissor OLED 128 × 64** · Ref.: `OLED-PANEL`
  - Função: Matriz visível que apresenta os valores e o traçado ao usuário.
  - Local: Módulo OLED frontal
  - Tag de origem no inventário V1: `UG-V1-0030`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto real do conjunto, sem foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B039 — Controlador SH110X** · Ref.: `OLED-CTRL`
  - Função: Controlador integrado ao módulo OLED; chip não necessariamente visível.
  - Local: Módulo OLED frontal
  - Tag de origem no inventário V1: `UG-V1-0030`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto real do conjunto, sem foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B040 — Pinos VDD/GND/SCK/SDA** · Ref.: `OLED-PINS`
  - Função: Interface I²C e alimentação; a ordem de pinos deve ser verificada antes de conectar.
  - Local: Módulo OLED frontal · Pendências: Pode haver módulos comerciais com VDD/GND invertidos.
  - Tag de origem no inventário V1: `UG-V1-0030`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto real do conjunto, sem foto isolada)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md

### UG-V1-S10 · Placa-base e estrutura

- **Categoria:** subsistema · **Pertence a:** Sistema V1
- **Descrição:** PCB principal, trilhas, fixações, conectores mecânicos e suporte do conjunto.
- **Localização:** Toda a PCB, frente e verso
- **Referência:** https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **Imagem:** https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png (Render oficial da PCB; não foto)
- **Componentes cadastrados:** 9

- **UG-V1-0001 — PCB DiamondGeezer V1** · Ref.: `PCB` · Modelo: DiamondGeezer KiCad V1
  - Função: Interliga todos os módulos e suporta a montagem.
  - Local: Base principal
  - Tag de origem no inventário V1: `UG-V1-0001`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Fotografia real da montagem)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-0033 — Espaçadores de PCB** · Ref.: `SPACER` · Modelo: Colunas de fixação
  - Função: Separam mecanicamente placa e módulos.
  - Local: PCB
  - Tag de origem no inventário V1: `UG-V1-0033`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **UG-V1-0029 — Suportes e fios de fixação** · Ref.: `FIX` · Modelo: Cobre, suportes da placa
  - Função: Mantêm os módulos alinhados e fixos.
  - Local: PCB/prisma
  - Tag de origem no inventário V1: `UG-V1-0029`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/BuildGuide/images/device-v1.png (Foto do conjunto)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- **UG-V1-0032 — Ímã de ensaio** · Ref.: `B-TEST` · Modelo: Ímã pequeno
  - Função: Permite verificar respostas do sensor a mudanças do campo.
  - Local: Externo, próximo ao prisma · Pendências: O guia menciona um ímã pequeno para teste, sem exigir composição específica. Exemplos: disco NdFeB pequeno; cubo NdFeB pequeno; ímã de ferrite pequeno (campo menor em geral). Controlar distância e evitar saturar/deslocar excessivamente a ressonância.
  - Tag de origem no inventário V1: `UG-V1-0032`
  - Imagem: https://raw.githubusercontent.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab/main/assets/components/illustrative/UgV1ImaNeodimioDiscoIlustrativo.png (Imagem gerada por IA — ilustrativa; não corresponde necessariamente ao modelo original.)
  - Fonte: https://commons.wikimedia.org/wiki/File:Neodym_Magnete.jpg — Domínio público
- **UG-V1-B041 — Face frontal da PCB** · Ref.: `PCB-FRONT`
  - Função: Região da placa com laser, analógico, ESP32, OLED e amplificador.
  - Local: Frente da PCB · Pendências: Componente estrutural; identificação geométrica requer arquivo KiCad.
  - Tag de origem no inventário V1: `UG-V1-0001`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png (Render oficial da face frontal)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B042 — Face traseira da PCB** · Ref.: `PCB-BACK`
  - Função: Região para gerador ADF4351 e conexões.
  - Local: Verso da PCB · Pendências: Componente estrutural; identificação geométrica requer arquivo KiCad.
  - Tag de origem no inventário V1: `UG-V1-0001`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-2.png (Render oficial da face traseira)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B043 — Trilhas de cobre** · Ref.: `PCB-TRACES`
  - Função: Interligações de sinais, alimentação e referência de terra.
  - Local: Dentro e sobre as camadas da PCB · Pendências: Componente estrutural; identificação geométrica requer arquivo KiCad.
  - Tag de origem no inventário V1: `UG-V1-0001`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png (Render oficial da PCB)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B044 — Pads / ilhas de solda** · Ref.: `PCB-PADS`
  - Função: Áreas para conexão e montagem de componentes.
  - Local: Superfície da PCB · Pendências: Componente estrutural; identificação geométrica requer arquivo KiCad.
  - Tag de origem no inventário V1: `UG-V1-0001`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png (Render oficial da PCB)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- **UG-V1-B045 — Soquetes / headers mecânicos** · Ref.: `PCB-HEADERS`
  - Função: Encaixes entre módulos comerciais e placa principal.
  - Local: Face frontal e verso · Pendências: Componente estrutural; identificação geométrica requer arquivo KiCad.
  - Tag de origem no inventário V1: `UG-V1-0001`
  - Imagem: https://raw.githubusercontent.com/QuantumVillage/UncutGem/main/hardware/PCB/images/DiamondGeezer-1.png (Render oficial da PCB)
  - Fonte: https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md

## Modelo de interação proposto — apenas Camadas A e B

1. **Visão geral:** imagem real da montagem Uncut Gem V1 com seletor de camada A/B.
2. **Camada A:** retângulos translúcidos delimitam apenas regiões fisicamente verificadas na fotografia adequada; hover altera cor e apresenta nome/ação Expandir.
3. **Expandir subsistema:** imagem principal faz zoom para a região e conserva coordenadas relativas; um único painel lateral de inspeção apresenta o subsistema.
4. **Camada B:** sobre a área ampliada, desenhar hotspots retangulares menores para peças com geometria e posição **confirmadas** no original e/ou no arquivo KiCad; clicar abre a mesma ficha lateral.
5. **Voltar:** restaurar enquadramento anterior e retornar aos subsistemas. No futuro, permitir camadas combinadas; Camada C segue fora de escopo.
6. **Relações:** cada componente tem exatamente um pai primário (`Pertence a`), e pode ter vínculos funcionais adicionais em notas, sem duplicar tags.

## Limitações de identificação e fidelidade

- Uma foto geral vinculada a um registro **não é** uma fotografia individual da peça; `Tipo de imagem` registra a natureza visual.
- O ADF4351 fica no **verso**; não posicionar hotspot na face frontal.
- O **BPW34** e o filtro vermelho estão encapsulados no prisma; usar o guia de montagem em camadas para explicar, sem hotspot fictício em foto opaca.
- O **ADC do ESP32** é funcionalidade integrada ao microcontrolador, não um componente externo com hotspot próprio.
- Modelos de chips comerciais, valores de SMDs do módulo RF, pinagens e posições minúsculas **não devem ser inventados**; marcar verificação pendente.
- A coluna `Imagem` usa `IMAGE(url)` do Sheets. A renderização pode exigir autorização do Google; a URL original permanece disponível em `URL da imagem`.
- `Ímã de ensaio` é acessório externo (não soldado à PCB) e deve ser apresentado como tal.

## Fontes primárias

- https://github.com/QuantumVillage/UncutGem
- https://github.com/QuantumVillage/UncutGem/blob/main/hardware/PCB/README.md
- https://github.com/QuantumVillage/UncutGem/blob/main/hardware/DiamondMount/README.md
- https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/BuildGuide.md
- https://github.com/QuantumVillage/UncutGem/blob/main/firmware/README.md

## Próximos passos (não implementados nesta entrega)

1. Conferir fotos reais e KiCad; gerar retângulos/IDs espaciais para cada subsistema e componente visual.
2. Reconciliar os registros detalhados com os grupos de passivos da aba V1 e validar datasheets/valores.
3. Implementar o seletor A/B na aplicação web e o painel contextual compartilhado.
4. Discutir a Camada C apenas depois da validação visual das duas primeiras.

---
**Verificação de conteúdo:** 10 subsistemas + 69 componentes = 79 registros; todos com tag única e relação `Pertence a`.