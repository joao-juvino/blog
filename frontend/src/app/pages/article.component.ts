import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ApiService } from '../core/api.service';
import { Post } from '../core/models';
import { SeoService } from '../core/seo.service';
import { MarkdownComponent } from '../shared/markdown.component';
import { PostCardComponent } from '../shared/post-card.component';

interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

@Component({
  imports: [DatePipe, RouterLink, MarkdownComponent, PostCardComponent],
  template: `
    @if (loading()) {
      <div class="narrow section" aria-live="polite">
        <div class="skeleton hero-skel"></div>
        <div class="skeleton body-skel"></div>
      </div>
    } @else if (error()) {
      <div class="narrow section empty">
        <h1>Artigo indisponível</h1>
        <p class="muted">O conteúdo não foi encontrado ou o servidor está iniciando.</p>
        <button class="btn" (click)="reloadCurrent()">Tentar novamente</button>
        <a class="btn" routerLink="/artigos">Ver artigos</a>
      </div>
    } @else if (post(); as article) {
      <article>
        <header class="article-head">
          <div class="narrow">
            <a class="eyebrow" routerLink="/artigos">← {{ article.category?.name || 'Artigos' }}</a>
            <h1>{{ article.title }}</h1>
            <p class="summary">{{ article.summary }}</p>
            <div class="byline">
              <div class="avatar">JJ</div>
              <div>
                <strong>João Juvino</strong>
                <span>
                  Publicado em {{ article.publishedAt | date: 'dd MMM yyyy' }} ·
                  Atualizado em {{ article.updatedAt | date: 'dd MMM yyyy' }} ·
                  {{ article.readingTime }} min
                </span>
              </div>
            </div>
            <div class="pill-row">
              @for (articleTag of article.tags; track articleTag.id) {
                <span class="tag">{{ articleTag.name }}</span>
              }
            </div>
          </div>
        </header>

        @if (article.coverImageUrl) {
          <div class="container cover">
            <img [src]="article.coverImageUrl" [alt]="'Capa do artigo ' + article.title">
          </div>
        }

        <div class="container article-layout">
          <aside class="toc" aria-label="Índice do artigo">
            <strong>Neste artigo</strong>
            @for (heading of headings(); track heading.id) {
              <button
                type="button"
                [class.sub]="heading.level === 3"
                (click)="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </button>
            }
          </aside>

          <div>
            <app-markdown [content]="article.content" />

            @if (article.project) {
              <section class="related-project card">
                <p class="eyebrow">Projeto relacionado</p>
                <h2>{{ article.project.name }}</h2>
                <p>{{ article.project.description }}</p>
                <div class="pill-row">
                  @for (technology of article.project.technologies; track technology) {
                    <span class="tag">{{ technology }}</span>
                  }
                </div>
                <div class="links">
                  @if (article.project.githubUrl) {
                    <a class="btn" [href]="article.project.githubUrl" target="_blank">Código ↗</a>
                  }
                  @if (article.project.demoUrl) {
                    <a class="btn brand" [href]="article.project.demoUrl" target="_blank">Demo ↗</a>
                  }
                </div>
              </section>
            }
          </div>
        </div>
      </article>

      @if (article.related.length) {
        <section class="section related-articles">
          <div class="container">
            <div class="section-head"><h2>Continue lendo</h2></div>
            <div class="grid">
              @for (relatedArticle of article.related; track relatedArticle.id) {
                <app-post-card [post]="relatedArticle" />
              }
            </div>
          </div>
        </section>
      }
    }
  `,
  styles: [`
    .article-head{padding:85px 0 55px;text-align:center;background:radial-gradient(circle at 50% 0,color-mix(in srgb,var(--brand),transparent 84%),transparent 45%)}
    .article-head h1{font-size:clamp(2.6rem,6vw,5rem)}
    .summary{font-size:1.2rem;color:var(--muted)}
    .byline{display:flex;justify-content:center;align-items:center;gap:12px;margin:28px 0}
    .byline>div:last-child{display:grid;text-align:left}
    .byline span{font-size:.82rem;color:var(--muted)}
    .avatar{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--text);color:var(--bg);font-weight:800}
    .article-head .pill-row{justify-content:center}
    .cover{border-radius:24px;overflow:hidden;max-height:580px}
    .cover img{width:100%;height:100%;object-fit:cover}
    .article-layout{display:grid;grid-template-columns:210px minmax(0,780px);justify-content:center;gap:50px;padding-top:60px}
    .toc{position:sticky;top:100px;align-self:start;display:grid;gap:4px;border-left:1px solid var(--line);padding-left:18px;font-size:.84rem}
    .toc strong{margin-bottom:7px}
    .toc button{appearance:none;border:0;background:transparent;color:var(--muted);cursor:pointer;padding:4px 0;text-align:left;line-height:1.5;transition:color .18s,transform .18s}
    .toc button:hover{color:var(--brand);transform:translateX(3px)}
    .toc button:focus-visible{outline:2px solid var(--brand);outline-offset:3px;border-radius:3px}
    .toc .sub{padding-left:14px}
    .related-project{padding:28px;margin-top:55px}
    .links{display:flex;gap:10px;margin-top:20px}
    .hero-skel{height:330px}
    .body-skel{height:500px;margin-top:30px}
    @media(max-width:900px){.article-layout{grid-template-columns:1fr}.toc{display:none}}
  `]
})
export class ArticleComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly post = signal<Post | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly headings = signal<ArticleHeading[]>([]);
  private readonly currentSlug = signal('');

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.load(params.get('slug') || ''));
  }

  reloadCurrent(): void {
    this.load(this.currentSlug());
  }

  scrollToHeading(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
  }

  private load(slug: string): void {
    if (!slug) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.currentSlug.set(slug);
    this.loading.set(true);
    this.error.set(false);
    window.scrollTo({ top: 0, behavior: 'auto' });

    this.api.post(slug).subscribe({
      next: article => {
        this.post.set(article);
        this.headings.set(this.extractHeadings(article.content));
        this.seo.set(article.title, article.summary, `/artigos/${article.slug}`);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private extractHeadings(markdown: string): ArticleHeading[] {
    return [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map(match => ({
      level: match[1].length,
      text: match[2].replace(/[*_`]/g, ''),
      id: this.slugify(match[2])
    }));
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
