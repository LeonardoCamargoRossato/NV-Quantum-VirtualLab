/** Coordenadas percentuais avaliadas sobre a fotografia oficial V1 (1000×743).
 * Não confundir os recortes da foto de conjunto com fotografias de produto.
 * Fonte: QuantumVillage/UncutGem/BuildGuide/images/device-v1.png (AGPL-3.0).
 */
export type PhotoRegion = { tag: string; short: string; x: number; y: number; w: number; h: number; markerX: number; markerY: number; note: string };
export const PHOTO_REGIONS: PhotoRegion[] = [
  { tag: "UG-V1-0001", short: "PCB V1", x: 2, y: 5, w: 69, h: 86, markerX: 39, markerY: 38, note: "Placa de suporte e interconexão; recorte do conjunto." },
  { tag: "UG-V1-0004", short: "ESP32", x: 8, y: 61, w: 38, h: 30, markerX: 31, markerY: 77, note: "Módulo controlador presente na parte inferior esquerda." },
  { tag: "UG-V1-0019", short: "Amplificador RF", x: 41, y: 43, w: 32, h: 25, markerX: 57, markerY: 55, note: "Módulo de amplificação RF e conexões SMA, no centro à direita." },
  { tag: "UG-V1-0022", short: "Laser", x: 10, y: 17, w: 23, h: 18, markerX: 21, markerY: 24, note: "Módulo cilíndrico do laser verde no alto à esquerda." },
  { tag: "UG-V1-0023", short: "Prisma NV", x: 42, y: 11, w: 18, h: 24, markerX: 50, markerY: 23, note: "Prisma óptico encapsulado; detalhes internos não são visíveis com precisão." },
  { tag: "UG-V1-0030", short: "OLED", x: 44, y: 64, w: 27, h: 32, markerX: 57, markerY: 79, note: "Tela OLED na parte inferior direita." },
];
export const findPhotoRegion = (tag: string) => PHOTO_REGIONS.find((r) => r.tag === tag);
export const PHOTO_ORIGINAL_URL = "https://github.com/QuantumVillage/UncutGem/blob/main/BuildGuide/images/device-v1.png";
/** 1000 / 743 = razão de aspecto da imagem original. */
export function cropAspect(region: PhotoRegion): number {
  return (1000 * region.w) / (743 * region.h);
}
