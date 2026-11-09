import { presentedAsset } from "./ImagePresentation";
/** Fluxo didático — Uncut Gem V1.
 * Dados de componentes da planilha V1; descrições contextualizadas pelo BuildGuide.
 * Fotos derivadas da imagem oficial (Quantum Village); nenhuma foto de produto inventada.
 */
export type FlowStep = {
  id: string;
  number: number;
  title: string;
  summary: string;
  detail: string;
  connection: string;
  image: string;
  imageAlt: string;
  imageKind: "Recorte da montagem oficial" | "Diagrama oficial";
  imageNote: string;
  sourceUrl: string;
  pcbTag: string;
  relatedTags: string[];
  branch?: "optical" | "microwave";
};
const official = "https://github.com/QuantumVillage/UncutGem";
const crops = "assets/official/v1/enhanced/";
export const FLOW_STEPS: FlowStep[] = [
  {
    id:"alimentacao", number:1, title:"Alimentação e energia",
    summary:"Uma alimentação USB de 5 V protegida fornece energia à eletrônica.",
    detail:"A entrada e distribuição de energia alimentam os circuitos da montagem. É necessário conferir polaridade, tensões e pinagem antes de ligar a placa; uma fonte externa protegida não está individualmente fotografada no conjunto.",
    connection:"A alimentação disponibiliza energia para o controlador, a seção óptica e os módulos de RF.",
    image:crops+"UgV1Esp32Enhanced.png",imageAlt:"Região do ESP32 com conector USB da fotografia oficial",
    imageKind:"Recorte da montagem oficial",
    imageNote:"Mostra a conexão USB na placa, não uma fotografia da fonte protegida externa.",
    sourceUrl:official+"/blob/main/BuildGuide/BuildGuide.md",
    pcbTag:"UG-V1-0013",relatedTags:["UG-V1-0031","UG-V1-0004"],
  },
  {
    id:"controlador",number:2,title:"Controlador ESP32",
    summary:"Coordena os comandos, a varredura de micro-ondas, a aquisição e o display.",
    detail:"O ESP32 comanda o gerador RF ADF4351, lê o sinal elétrico pelo ADC e atualiza a tela OLED. Os detalhes de firmware e comunicação devem ser conferidos no projeto original.",
    connection:"O comando do ESP32 organiza dois ramos: excitação óptica e excitação de spin por micro-ondas.",
    image:crops+"UgV1Esp32Enhanced.png",imageAlt:"Módulo ESP32 da montagem oficial",
    imageKind:"Recorte da montagem oficial",imageNote:"Módulo ESP32 recortado da fotografia geral.",
    sourceUrl:official+"/tree/main/firmware",
    pcbTag:"UG-V1-0004",relatedTags:["UG-V1-0004"],
  },
  {
    id:"optico",number:3,title:"Ramo óptico — laser verde",
    summary:"A luz verde excita os centros NV do diamante.",
    detail:"O laser verde, tipicamente na faixa de 520–532 nm conforme o inventário, ilumina o diamante. A emissão fluorescente depende do estado de spin. Evite exposição ocular ao feixe e reflexos.",
    connection:"A iluminação verde chega ao prisma em paralelo às micro-ondas, não depois delas.",
    image:crops+"UgV1LaserEnhanced.png",imageAlt:"Laser verde no recorte oficial",
    imageKind:"Recorte da montagem oficial",imageNote:"Foto do módulo laser acoplado ao conjunto.",
    sourceUrl:official+"/blob/main/BuildGuide/BuildGuide.md",
    pcbTag:"UG-V1-0022",relatedTags:["UG-V1-0022"],branch:"optical",
  },
  {
    id:"microondas",number:4,title:"Ramo de micro-ondas — ADF4351 e RF",
    summary:"O gerador ADF4351 e o amplificador RF alimentam uma antena próxima ao diamante.",
    detail:"O ADF4351, montado no verso da PCB, sintetiza frequências na região de ressonância dos NV (próxima de 2,87 GHz, dependendo do campo). O sinal segue por conexões RF/SMA, passa pelo amplificador e alcança o laço de cobre junto ao diamante.",
    connection:"A excitação por micro-ondas converge com o feixe verde no mesmo conjunto NV.",
    image:crops+"UgV1RfAmpEnhanced.png",imageAlt:"Amplificador RF da montagem oficial",
    imageKind:"Recorte da montagem oficial",imageNote:"O recorte mostra o amplificador RF da frente; o ADF4351 no verso NÃO é visível aqui.",
    sourceUrl:official+"/blob/main/BuildGuide/BuildGuide.md",
    pcbTag:"UG-V1-0019",relatedTags:["UG-V1-0018","UG-V1-0019","UG-V1-0020","UG-V1-0021"],branch:"microwave",
  },
  {
    id:"prisma",number:5,title:"Diamante NV e prisma",
    summary:"O diamante recebe luz e micro-ondas simultaneamente; seu spin responde ao campo magnético.",
    detail:"O diamante NV está encapsulado com o laço de antena. A excitação óptica e a excitação de micro-ondas atuam juntas: a resposta do spin modula a intensidade da fluorescência. O filtro vermelho atenua luz verde antes da detecção no BPW34.",
    connection:"A fluorescência atravessa o filtro e alcança o fotodiodo encapsulado.",
    image:crops+"UgV1PrismEnhanced.png",imageAlt:"Conjunto físico do prisma na montagem original",
    imageKind:"Recorte da montagem oficial",imageNote:"Os elementos internos encapsulados não podem ser diferenciados nesta fotografia.",
    sourceUrl:official+"/tree/main/hardware/DiamondMount",
    pcbTag:"UG-V1-0023",relatedTags:["UG-V1-0023","UG-V1-0024","UG-V1-0027","UG-V1-0028"],
  },
  {
    id:"medicao",number:6,title:"Fotodetecção e amplificação",
    summary:"O fotodiodo BPW34 converte a fluorescência em corrente, condicionada pela eletrônica com TL082.",
    detail:"O BPW34 está fisicamente no prisma e não no conector da PCB: PHOTODIODE1 apenas faz a ligação elétrica. O sinal do fotodiodo é amplificado/condicionado pela seção de TIA da placa, associada ao TL082, antes da aquisição.",
    connection:"O sinal óptico foi transformado em sinal elétrico para leitura no controlador.",
    image:"assets/official/Layer3.png",imageAlt:"Diagrama oficial da terceira camada com filtro vermelho e fotodiodo",
    imageKind:"Diagrama oficial",imageNote:"É um diagrama de montagem, NÃO uma fotografia individual do BPW34 ou do TL082.",
    sourceUrl:official+"/tree/main/hardware/DiamondMount",
    pcbTag:"UG-V1-0028",relatedTags:["UG-V1-0028","UG-V1-0016","UG-V1-0005"],
  },
  {
    id:"leitura",number:7,title:"ADC do ESP32 e OLED",
    summary:"O ESP32 digitaliza o sinal e a tela OLED apresenta o resultado.",
    detail:"O controlador lê a tensão condicionada em seu ADC e processa as medidas conforme o firmware. A tela OLED exibe mensagens, calibração e traçados documentados no projeto, permitindo observar a resposta à varredura RF.",
    connection:"A leitura pode ser relacionada às frequências de micro-ondas e ao campo externo; esta interface não simula os dados.",
    image:crops+"UgV1OledEnhanced.png",imageAlt:"Tela OLED na montagem Uncut Gem V1",
    imageKind:"Recorte da montagem oficial",imageNote:"O conteúdo visível na foto é uma leitura real registrada na montagem, não um resultado calculado nesta página.",
    sourceUrl:official+"/tree/main/firmware",
    pcbTag:"UG-V1-0030",relatedTags:["UG-V1-0030","UG-V1-0004"],
  },
];
export function flowImageUrl(step:FlowStep,base:string):string{return presentedAsset(base+step.image,base);}
export function getFlowStep(id:string):FlowStep|undefined{return FLOW_STEPS.find(step=>step.id===id);}
