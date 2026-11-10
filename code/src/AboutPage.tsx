import {InteractiveImage} from "./InteractiveImage";
import React from "react";
import { SectionHeading, Out } from "./StudyPages";

export function AboutPage(){
  return <div className="study-page about-page">
    <SectionHeading eyebrow="PROJETO ACADÊMICO INDEPENDENTE" title="Sobre o Projeto" subtitle="Um ambiente de aprendizado sobre centros NV em diamante, instrumentação e magnetometria."/>
    <section className="about-lead">
      <div><span className="paper-type">NV QUANTUM VIRTUAL LAB</span><h2>Hardware real como ponto de partida</h2>
        <p>O laboratório virtual reúne fotografia, componentes, documentos e explicações para estudar como o sistema aberto <strong>Uncut Gem V1</strong> combina excitação óptica, micro-ondas, leitura de fluorescência e eletrônica de aquisição.</p>
        <p>Seu foco atual é explicar o funcionamento e a montagem real, com rastreabilidade às fontes originais e ao inventário. Os diagramas e recortes não substituem documentação técnica ou medições laboratoriais.</p>
      </div>
      <figure><InteractiveImage src={import.meta.env.BASE_URL+"assets/official/DeviceV1.png"} alt="Foto real do hardware Uncut Gem V1, Quantum Village"/><figcaption>Fotografia oficial da montagem · Quantum Village, AGPL-3.0</figcaption></figure>
    </section>
    <div className="about-grid">
      <section><span className="step-no">01</span><h3>Contexto acadêmico</h3><p>Iniciativa de estudo ligada à formação e à pesquisa de doutorado em engenharia, com interesse em sensores quânticos, instrumentação e métodos de pesquisa. Projeto independente, sem declaração de endosso institucional do ITA.</p></section>
      <section><span className="step-no">02</span><h3>Objetivo</h3><p>Conectar peças reais, seus caminhos de sinal e a literatura científica para apoiar compreensão e aprendizado sobre magnetometria com centros NV.</p></section>
      <section><span className="step-no">03</span><h3>Próximas linhas</h3><p>Modelagem e fluxo matemático, simulações físicas validadas, visualização tridimensional e novas integrações são possibilidades futuras. Nenhuma dessas funcionalidades está implementada agora.</p></section>
    </div>
    <div className="about-footer-links"><Out href="https://github.com/QuantumVillage/UncutGem">Hardware original — Quantum Village</Out><Out href="https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab">Repositório do laboratório</Out><Out href="https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/#/">Portfólio do autor</Out></div>
  </div>;
}
