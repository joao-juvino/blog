export type Status='DRAFT'|'PUBLISHED';
export interface Taxonomy{id:number;name:string;slug:string}
export interface Project{id:number;name:string;slug:string;description:string;imageUrl?:string;githubUrl?:string;demoUrl?:string;technologies:string[]}
export interface PostSummary{id:number;title:string;slug:string;summary:string;coverImageUrl?:string;status:Status;featured:boolean;publishedAt?:string;updatedAt?:string;readingTime:number;category?:Taxonomy;tags:Taxonomy[]}
export interface Post extends PostSummary{content:string;createdAt:string;updatedAt:string;project?:Project;related:PostSummary[]}
export interface Page<T>{content:T[];totalElements:number;totalPages:number;number:number;size:number}
export interface PostRequest{title:string;slug?:string;summary:string;content:string;coverImageUrl?:string;status:Status;featured:boolean;categoryId:number|null;tagIds:number[];projectId:number|null}
export interface Dashboard{total:number;published:number;drafts:number;recent:PostSummary[]}
