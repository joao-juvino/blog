import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { ApiService } from '../core/api.service';
import { PostSummary, Taxonomy } from '../core/models';
import { SeoService } from '../core/seo.service';
import { PostCardComponent } from '../shared/post-card.component';

@Component({
  imports: [ReactiveFormsModule, PostCardComponent],
  template: `
    <section class="page-head"><div class="container"><p class="eyebrow">Base de conhecimento</p><h1>Artigos</h1><p class="muted">Guias, decisões e aprendizados para quem constrói software.</p></div></section>
    <section class="container layout">
      <aside>
        <div class="field"><label for="search">Buscar</label><input id="search" class="input" [formControl]="search" placeholder="Título, resumo ou conteúdo"></div>
        <div class="filters">
          <strong>Categorias</strong>
          <button [class.active]="!category()" (click)="setCategory('')">Todas</button>
          @for (item of categories(); track item.id) { <button [class.active]="category() === item.slug" (click)="setCategory(item.slug)">{{ item.name }}</button> }
        </div>
        <div class="filters">
          <strong>Tags</strong>
          <div class="pill-row">
            @for (item of tags(); track item.id) {
              <button class="tag" [class.active]="tag() === item.slug" (click)="setTag(tag() === item.slug ? '' : item.slug)">{{ item.name }}</button>
            }
          </div>
        </div>
      </aside>
      <div>
        @if (loading()) {
          <div class="grid">@for (item of [1, 2, 3, 4, 5, 6]; track item) { <div class="skeleton"></div> }</div>
        } @else if (error()) {
          <div class="alert">Não foi possível carregar os artigos. <button class="btn" (click)="load()">Tentar novamente</button></div>
        } @else if (!posts().length) {
          <div class="empty"><h2>Nenhum artigo encontrado</h2><p class="muted">Tente remover alguns filtros ou usar outros termos.</p><button class="btn" (click)="clear()">Limpar filtros</button></div>
        } @else {
          <div class="results">
            <span class="muted">{{ total() }} resultado(s)</span>
            <div class="grid">@for (article of posts(); track article.id) { <app-post-card [post]="article" /> }</div>
            <div class="pagination"><button class="btn" [disabled]="page() === 0" (click)="go(page() - 1)">← Anterior</button><span>Página {{ page() + 1 }} de {{ pages() }}</span><button class="btn" [disabled]="page() + 1 >= pages()" (click)="go(page() + 1)">Próxima →</button></div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .page-head{padding:75px 0 40px}.page-head h1{font-size:4rem;margin:.1em 0}.layout{display:grid;grid-template-columns:230px 1fr;gap:40px;align-items:start}
    aside{position:sticky;top:100px;display:grid;gap:30px}.filters{display:grid;gap:7px}.filters>button{background:none;border:0;color:var(--muted);text-align:left;padding:5px 0;cursor:pointer}
    .filters>button.active{color:var(--brand);font-weight:700}.tag{border:0;cursor:pointer}.filters .tag.active{background:var(--brand);color:#fff;font-weight:700}
    .results>.muted{display:block;margin-bottom:15px}.pagination{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:35px}.btn:disabled{opacity:.4;cursor:not-allowed}
    @media(max-width:800px){.layout{grid-template-columns:1fr}aside{position:static}.filters{display:block}.filters>button{margin-right:16px}}
  `]
})
export class ArticlesComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly search = new FormControl('', { nonNullable: true });
  readonly posts = signal<PostSummary[]>([]);
  readonly categories = signal<Taxonomy[]>([]);
  readonly tags = signal<Taxonomy[]>([]);
  readonly category = signal('');
  readonly tag = signal('');
  readonly page = signal(0);
  readonly pages = signal(1);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    inject(SeoService).set('Artigos', 'Guias e aprendizados sobre desenvolvimento fullstack.', '/artigos');
    const query = this.route.snapshot.queryParamMap;
    this.search.setValue(query.get('q') || '', { emitEvent: false });
    this.category.set(query.get('category') || '');
    this.tag.set(query.get('tag') || '');
    this.page.set(Number(query.get('page') || 0));
    forkJoin([this.api.categories(), this.api.tags()]).subscribe(([categories, tags]) => { this.categories.set(categories); this.tags.set(tags); });
    this.search.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => { this.page.set(0); this.sync(); this.load(); });
    this.load();
  }

  setCategory(value: string): void { this.category.set(value); this.page.set(0); this.sync(); this.load(); }
  setTag(value: string): void { this.tag.set(value); this.page.set(0); this.sync(); this.load(); }
  go(page: number): void { this.page.set(page); this.sync(); this.load(); scrollTo({ top: 0, behavior: 'smooth' }); }
  clear(): void { this.search.setValue('', { emitEvent: false }); this.category.set(''); this.tag.set(''); this.page.set(0); this.sync(); this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.posts({ q: this.search.value, category: this.category(), tag: this.tag(), page: this.page(), size: 9 }).subscribe({
      next: response => { this.posts.set(response.content); this.pages.set(Math.max(1, response.totalPages)); this.total.set(response.totalElements); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  private sync(): void {
    this.router.navigate([], { queryParams: { q: this.search.value || null, category: this.category() || null, tag: this.tag() || null, page: this.page() || null }, queryParamsHandling: 'merge', replaceUrl: true });
  }
}
