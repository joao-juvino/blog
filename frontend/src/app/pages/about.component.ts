import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../core/seo.service';

@Component({
  imports: [RouterLink],
  template: `
    <section class="about container section">
      <div class="intro">
        <div class="portrait">
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
          <div class="actions">
            <a class="btn brand" routerLink="/artigos">Conheça meu trabalho →</a>
            <a class="btn" href="https://github.com/joao-juvino" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a class="btn" href="https://joao-juvino.github.io" target="_blank" rel="noopener noreferrer">Portfólio ↗</a>
          </div>
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
    .portrait{position:relative;isolation:isolate;aspect-ratio:4/5;padding:10px;border:1px solid var(--line);border-radius:30px;background:var(--surface);box-shadow:0 24px 65px rgba(15,23,42,.13)}
    .portrait::before{content:'';position:absolute;inset:14px -14px -14px 14px;z-index:-1;border:1px solid color-mix(in srgb,var(--brand),transparent 58%);border-radius:30px}
    .portrait::after{content:'';position:absolute;left:34px;right:34px;bottom:-25px;z-index:-2;height:40px;border-radius:50%;background:rgba(15,23,42,.14);filter:blur(18px)}
    .portrait img{display:block;width:100%;height:100%;border-radius:21px;background:color-mix(in srgb,var(--surface),var(--text) 4%);object-fit:cover;object-position:center top}
    .presentation h1{font-size:clamp(2.6rem,5vw,4.8rem);margin:.12em 0 .28em}
    .lead{font-size:clamp(1.15rem,2vw,1.4rem);line-height:1.65}
    .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
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
