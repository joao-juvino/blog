import { Component,ElementRef,inject,input,OnChanges,AfterViewChecked } from '@angular/core';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';import DOMPurify from 'dompurify';import hljs from 'highlight.js';
@Component({selector:'app-markdown',template:`<div class="prose" [innerHTML]="html"></div>`,styles:[`:host ::ng-deep .copy-code{position:absolute;right:10px;top:10px;border:1px solid #39445d;background:#192135;color:#dfe5ef;border-radius:7px;padding:5px 9px;cursor:pointer;font-size:.75rem}`]})
export class MarkdownComponent implements OnChanges,AfterViewChecked{
 content=input<string|null>('');html:SafeHtml='';private sanitizer=inject(DomSanitizer);private host:ElementRef<HTMLElement>=inject(ElementRef);private processed='';
 ngOnChanges(){const raw=marked.parse(this.content()||'',{async:false}) as string;this.html=this.sanitizer.bypassSecurityTrustHtml(DOMPurify.sanitize(raw));this.processed=''}
 ngAfterViewChecked(){if(this.processed===(this.content()||''))return;this.host.nativeElement.querySelectorAll<HTMLElement>('h2,h3').forEach((el:HTMLElement)=>el.id=this.slug(el.textContent||''));this.host.nativeElement.querySelectorAll<HTMLElement>('pre code').forEach((el:HTMLElement)=>{hljs.highlightElement(el);const pre=el.parentElement;if(pre&&!pre.querySelector('button')){const b=document.createElement('button');b.textContent='Copiar';b.className='copy-code';b.addEventListener('click',async()=>{await navigator.clipboard.writeText(el.textContent||'');b.textContent='Copiado!';setTimeout(()=>b.textContent='Copiar',1500)});pre.appendChild(b)}});this.processed=this.content()||''}
 private slug(v:string){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}
}
