/** Pixel-preserving enhanced crops from the official V1 photograph.
 * All derived with Pillow from DeviceV1.png. These are NOT independent photos.
 */
export const ENHANCED_CROPS: Record<string, string> = {
  "UG-V1-0001": "UgV1PcbEnhanced.png",
  "UG-V1-0004": "UgV1Esp32Enhanced.png",
  "UG-V1-0019": "UgV1RfAmpEnhanced.png",
  "UG-V1-0022": "UgV1LaserEnhanced.png",
  "UG-V1-0023": "UgV1PrismEnhanced.png",
  "UG-V1-0030": "UgV1OledEnhanced.png",
};
export const ENHANCED_OVERVIEW = "UgV1OverviewEnhanced.png";
/** These four regions have descriptive names only, not unverified component tags. */
export const EXTRA_CROPS = [
  { id:"rf-cable", file:"UgV1RfCableEnhanced.png", title:"Conector / cabo próximo ao RF", note:"Região aproximada do cabo junto ao amplificador. A função exata das conexões requer verificação." },
  { id:"between", file:"UgV1BetweenRfAndEsp32Enhanced.png", title:"Região entre RF e ESP32", note:"Detalhes da placa entre os dois módulos; sem identificação adicional inferida." },
  { id:"above", file:"UgV1AboveEsp32Enhanced.png", title:"Região acima do ESP32", note:"Recorte descritivo: não atribui nome ou pinagem a peças pequenas." },
  { id:"laser-driver", file:"UgV1LaserDriverEnhanced.png", title:"Região do driver do laser", note:"Área próxima ao conjunto do laser; identidade e especificações do driver não comprovadas." },
] as const;
