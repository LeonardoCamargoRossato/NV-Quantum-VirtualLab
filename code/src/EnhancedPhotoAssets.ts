/** Pixel-preserving enhanced crops from the official V1 photograph.
 * All derived with Pillow from DeviceV1.png. These are NOT independent photos.
 */
export const ENHANCED_CROPS: Record<string, string> = {
  "UG-V1-0001": "ug-v1-pcb-enhanced.png",
  "UG-V1-0004": "ug-v1-esp32-enhanced.png",
  "UG-V1-0019": "ug-v1-rf-amp-enhanced.png",
  "UG-V1-0022": "ug-v1-laser-enhanced.png",
  "UG-V1-0023": "ug-v1-prism-enhanced.png",
  "UG-V1-0030": "ug-v1-oled-enhanced.png",
};
export const ENHANCED_OVERVIEW = "ug-v1-overview-enhanced.png";
/** These four regions have descriptive names only, not unverified component tags. */
export const EXTRA_CROPS = [
  { id:"rf-cable", file:"ug-v1-rf-cable-enhanced.png", title:"Conector / cabo próximo ao RF", note:"Região aproximada do cabo junto ao amplificador. A função exata das conexões requer verificação." },
  { id:"between", file:"ug-v1-between-rf-and-esp32-enhanced.png", title:"Região entre RF e ESP32", note:"Detalhes da placa entre os dois módulos; sem identificação adicional inferida." },
  { id:"above", file:"ug-v1-above-esp32-enhanced.png", title:"Região acima do ESP32", note:"Recorte descritivo: não atribui nome ou pinagem a peças pequenas." },
  { id:"laser-driver", file:"ug-v1-laser-driver-enhanced.png", title:"Região do driver do laser", note:"Área próxima ao conjunto do laser; identidade e especificações do driver não comprovadas." },
] as const;
