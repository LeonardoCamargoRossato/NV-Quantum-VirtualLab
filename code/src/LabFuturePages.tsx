import React from "react";
import { Out, SectionHeading } from "./StudyPages";

type Props = { kind: "v2" | "modelo3d"; onReturn: () => void };

/** Estados informativos: não existem dados de hardware V2 ou visualizador 3D validados. */
export function LabFuturePage({ kind, onReturn }: Props) {
  const isV2 = kind === "v2";
  return <div className="study-page future-lab-page">
    <SectionHeading
      eyebrow="LABORATÓRIO / PRÓXIMAS IMPLEMENTAÇÕES"
      title={isV2 ? "Uncut Gem V2" : "NV-Print 3D Stegemann"}
      subtitle={isV2
        ? "Área reservada a uma futura versão do hardware Uncut Gem."
        : "Área reservada à plataforma experimental modular impressa em 3D descrita por Stegemann e colaboradores."}
    />
    <div className="future-lab-panel">
      <div className="future-lab-mark" aria-hidden="true">{isV2 ? "V2" : "3D"}</div>
      <div className="future-lab-copy">
        <span className="future-lab-status">{isV2 ? "Ainda não identificado · Ainda não implementado" : "Implementações futuras"}</span>
        <h2>{isV2 ? "Hardware ainda não catalogado" : "Visualização tridimensional ainda não implementada"}</h2>
        <p>{isV2
          ? "Ainda não há inventário, imagens, esquema elétrico ou identificação de componentes da Uncut Gem V2 validados nesta plataforma. Nenhuma peça da versão anterior será apresentada como se pertencesse à V2."
          : "A referência científica “Modular low-cost 3D printed setup for experiments with NV centers in diamond” (2023) trata de uma montagem experimental modular com peças impressas em 3D. O modelo não está disponível para visualização ou interação neste laboratório."}</p>
        <div className="future-lab-actions">
          <button type="button" onClick={onReturn}>Voltar ao Uncut Gem V1</button>
          {!isV2 && <Out href="https://doi.org/10.1088/1361-6404/acbe7c">Consultar artigo de Stegemann et al. (2023)</Out>}
        </div>
      </div>
    </div>
  </div>;
}
