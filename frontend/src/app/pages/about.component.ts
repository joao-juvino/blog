import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../core/seo.service';

@Component({
  imports: [RouterLink],
  template: `
    <section class="about container section">
      <div class="intro">
        <div class="portrait">
          <div class="portrait-glow" aria-hidden="true"></div>
          <img src="/assets/joao-juvino.png" alt="Retrato profissional de João Juvino" width="1126" height="1403">
        </div>

        <div class="presentation">
          <p class="eyebrow">Sobre</p>
          <h1>Olá, sou João Juvino.</h1>
          <p class="lead">
            Engenheiro de software fullstack focado em transformar problemas reais em produtos
            simples, confiáveis e agradáveis de usar.
          </p>
          <p class="muted">
            Gosto de unir arquitetura bem pensada, código legível e uma experiência cuidadosa
            para quem usa e para quem mantém o software.
          </p>
          <a class="btn brand" routerLink="/artigos">Conheça meu trabalho →</a>
        </div>
      </div>

      <div class="journey">
        <div><p class="eyebrow">Como trabalho</p><h2>Clareza antes de complexidade.</h2></div>
        <div class="principles">
          <article class="card"><b>01</b><h3>Entender</h3><p class="muted">Começar pelo problema, contexto e pessoas impactadas.</p></article>
          <article class="card"><b>02</b><h3>Construir</h3><p class="muted">Entregar em ciclos curtos, com qualidade onde ela importa.</p></article>
          <article class="card"><b>03</b><h3>Aprender</h3><p class="muted">Medir, documentar e transformar experiência em conhecimento.</p></article>
        </div>
      </div>

      <section>
        <p class="eyebrow">Stack principal</p>
        <h2>Ferramentas que uso para construir.</h2>
        <div class="skills">
          @for (skill of skills; track skill.area) {
            <div><strong>{{ skill.area }}</strong><p class="muted">{{ skill.items }}</p></div>
          }
        </div>
      </section>
    </section>
  `,
  styles: [`
    .intro{display:grid;grid-template-columns:minmax(280px,390px) 1fr;gap:clamp(45px,7vw,90px);align-items:center}
    .portrait{position:relative;isolation:isolate;aspect-ratio:4/5;overflow:hidden;border:1px solid color-mix(in srgb,var(--brand),transparent 75%);border-radius:32px;background:linear-gradient(145deg,color-mix(in srgb,var(--brand),#121627 55%),color-mix(in srgb,var(--brand-2),#fff 25%));box-shadow:0 30px 80px color-mix(in srgb,var(--brand),transparent 78%)}
    .portrait::after{content:'';position:absolute;inset:auto 7% 4%;z-index:-1;height:24%;border-radius:50%;background:rgba(8,13,30,.28);filter:blur(24px)}
    .portrait-glow{position:absolute;inset:8% 10% auto;width:80%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.22);filter:blur(45px)}
    .portrait img{position:relative;z-index:1;width:100%;height:100%;object-fit:cover;object-position:center top}
    .presentation h1{font-size:clamp(2.6rem,5vw,4.8rem);margin:.12em 0 .28em}
    .lead{font-size:clamp(1.15rem,2vw,1.4rem);line-height:1.65}
    .presentation .btn{margin-top:18px}
    .journey{margin:110px 0}
    .principles{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .principles article{padding:26px}.principles b{color:var(--brand);font-family:'JetBrains Mono'}
    .skills{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line)}
    .skills>div{padding:22px;border-bottom:1px solid var(--line)}
    @media(max-width:750px){.intro{grid-template-columns:1fr}.portrait{width:min(100%,340px);margin:auto}.principles,.skills{grid-template-columns:1fr}.journey{margin:75px 0}}
  `]
})
export class AboutComponent {
  readonly skills = [
    { area: 'Backend', items: 'Java, Spring Boot, REST, Spring Security, JPA' },
    { area: 'Frontend', items: 'Angular, TypeScript, HTML, CSS, acessibilidade' },
    { area: 'Dados', items: 'PostgreSQL, Flyway, modelagem relacional' },
    { area: 'Entrega', items: 'Docker, GitHub Actions, Render, Supabase' }
  ];

  constructor() {
    inject(SeoService).set('Sobre', 'Conheça João Juvino e sua abordagem para engenharia de software.', '/sobre');
  }
}
