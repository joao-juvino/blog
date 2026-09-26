import { Routes } from '@angular/router';import { authGuard } from './core/auth.guard';
export const routes:Routes=[
 {path:'',loadComponent:()=>import('./pages/home.component').then(m=>m.HomeComponent),title:'Juvino Tech'},
 {path:'artigos',loadComponent:()=>import('./pages/articles.component').then(m=>m.ArticlesComponent),title:'Artigos — Juvino Tech'},
 {path:'artigos/:slug',loadComponent:()=>import('./pages/article.component').then(m=>m.ArticleComponent)},
 {path:'sobre',loadComponent:()=>import('./pages/about.component').then(m=>m.AboutComponent),title:'Sobre — Juvino Tech'},
 {path:'login',loadComponent:()=>import('./pages/login.component').then(m=>m.LoginComponent),title:'Login — Juvino Tech'},
 {path:'admin',canActivate:[authGuard],loadComponent:()=>import('./pages/admin.component').then(m=>m.AdminComponent),children:[{path:'',loadComponent:()=>import('./pages/dashboard.component').then(m=>m.DashboardComponent)},{path:'artigos/novo',loadComponent:()=>import('./pages/editor.component').then(m=>m.EditorComponent)},{path:'artigos/:id',loadComponent:()=>import('./pages/editor.component').then(m=>m.EditorComponent)},{path:'conteudo',loadComponent:()=>import('./pages/catalog.component').then(m=>m.CatalogComponent)}]},
 {path:'**',loadComponent:()=>import('./pages/not-found.component').then(m=>m.NotFoundComponent),title:'Página não encontrada — Juvino Tech'}];
