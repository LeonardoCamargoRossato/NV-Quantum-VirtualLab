import { describe, expect, it } from "vitest";
import { PHOTO_REGIONS, findPhotoRegion, cropAspect } from "./PhotoRegions";

describe("recortes oficiais V1", () => {
  it("usa seis tags únicas e coordenadas dentro da foto sem posicionamento imaginário", () => {
    expect(PHOTO_REGIONS).toHaveLength(6);
    expect(new Set(PHOTO_REGIONS.map(r => r.tag)).size).toBe(6);
    for (const region of PHOTO_REGIONS) {
      expect(region.tag).toMatch(/^UG-V1-\d{4}$/);
      expect(region.x).toBeGreaterThanOrEqual(0);
      expect(region.y).toBeGreaterThanOrEqual(0);
      expect(region.w).toBeGreaterThan(0);
      expect(region.h).toBeGreaterThan(0);
      expect(region.x + region.w).toBeLessThanOrEqual(100);
      expect(region.y + region.h).toBeLessThanOrEqual(100);
      expect(region.markerX).toBeGreaterThan(region.x);
      expect(region.markerX).toBeLessThan(region.x + region.w);
      expect(region.markerY).toBeGreaterThan(region.y);
      expect(region.markerY).toBeLessThan(region.y + region.h);
      expect(cropAspect(region)).toBeGreaterThan(0);
    }
  });
  it("não cria marcador para BPW34 nem mapeia o conector PHOTODIODE1 como fotodiodo físico", () => {
    expect(findPhotoRegion("UG-V1-0028")).toBeUndefined();
    expect(findPhotoRegion("UG-V1-0016")).toBeUndefined();
    expect(findPhotoRegion("UG-V1-0023")?.short).toBe("Prisma NV");
  });
});
