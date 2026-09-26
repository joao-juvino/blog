import { HttpClient,HttpParams } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Dashboard,Page,Post,PostRequest,PostSummary,Project,Taxonomy } from './models';
@Injectable({providedIn:'root'}) export class ApiService{
 private http=inject(HttpClient); private url=environment.apiUrl;
 posts(params:Record<string,string|number|boolean|undefined>={}){let p=new HttpParams();Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!=='')p=p.set(k,String(v))});return this.http.get<Page<PostSummary>>(`${this.url}/posts`,{params:p});}
 post(slug:string){return this.http.get<Post>(`${this.url}/posts/${slug}`)} categories(){return this.http.get<Taxonomy[]>(`${this.url}/categories`)} tags(){return this.http.get<Taxonomy[]>(`${this.url}/tags`)} projects(){return this.http.get<Project[]>(`${this.url}/projects`)}
 dashboard(){return this.http.get<Dashboard>(`${this.url}/admin/dashboard`)} adminPosts(){return this.http.get<Page<PostSummary>>(`${this.url}/admin/posts`)} adminPost(id:number){return this.http.get<Post>(`${this.url}/admin/posts/${id}`)} savePost(data:PostRequest,id?:number){return id?this.http.put<Post>(`${this.url}/admin/posts/${id}`,data):this.http.post<Post>(`${this.url}/admin/posts`,data)} deletePost(id:number){return this.http.delete<void>(`${this.url}/admin/posts/${id}`)}
 saveCategory(data:Partial<Taxonomy>,id?:number){return id?this.http.put<Taxonomy>(`${this.url}/admin/categories/${id}`,data):this.http.post<Taxonomy>(`${this.url}/admin/categories`,data)} saveTag(data:Partial<Taxonomy>,id?:number){return id?this.http.put<Taxonomy>(`${this.url}/admin/tags/${id}`,data):this.http.post<Taxonomy>(`${this.url}/admin/tags`,data)} saveProject(data:Partial<Project>,id?:number){return id?this.http.put<Project>(`${this.url}/admin/projects/${id}`,data):this.http.post<Project>(`${this.url}/admin/projects`,data)}
 upload(file:File){const body=new FormData();body.append('file',file);return this.http.post<{url:string}>(`${this.url}/admin/uploads`,body)}
}
