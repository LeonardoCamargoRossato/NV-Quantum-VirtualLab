import { describe, expect, it } from "vitest";
import { FLOW_STEPS, getFlowStep, flowImageUrl } from "./FlowData";

describe("fluxo Uncut Gem",()=>{
  it("organiza sete etapas, com dois ramos em paralelo",()=>{
    expect(FLOW_STEPS.map(s=>s.number)).toEqual([1,2,3,4,5,6,7]);
    expect(FLOW_STEPS.filter(s=>s.branch).map(s=>s.branch)).toEqual(["optical","microwave"]);
    expect(FLOW_STEPS[4].id).toBe("prisma");
    expect(new Set(FLOW_STEPS.map(s=>s.id)).size).toBe(7);
  });
  it("usa apenas imagens locais conhecidas, com procedência e vínculo ao inventário",()=>{
    const known=new Set(["UgV1Esp32Enhanced.png","UgV1LaserEnhanced.png","UgV1RfAmpEnhanced.png","UgV1PrismEnhanced.png","UgV1OledEnhanced.png","Layer3.png"]);
    for(const step of FLOW_STEPS){
      expect(known.has(step.image.split("/").at(-1)!)).toBe(true);
      expect(step.sourceUrl).toMatch(/^https:\/\//);
      expect(step.pcbTag).toMatch(/^UG-V1-\d{4}$/);
      expect(step.imageNote.length).toBeGreaterThan(15);
      expect(flowImageUrl(step,"/NV-Quantum-VirtualLab/")).toMatch(/^\/NV-Quantum-VirtualLab\/assets\//);
    }
  });
  it("não confunde o conector com o BPW34 físico",()=>{
    expect(getFlowStep("medicao")?.relatedTags).toEqual(expect.arrayContaining(["UG-V1-0028","UG-V1-0016"]));
    expect(getFlowStep("medicao")?.imageKind).toBe("Diagrama oficial");
    expect(getFlowStep("microondas")?.imageNote).toContain("NÃO é visível");
  });
});
