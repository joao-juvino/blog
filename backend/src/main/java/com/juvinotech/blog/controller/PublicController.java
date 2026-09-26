package com.juvinotech.blog.controller;

import com.juvinotech.blog.dto.ApiDtos.*; import com.juvinotech.blog.service.*; import lombok.RequiredArgsConstructor; import org.springframework.data.domain.Page; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class PublicController {
 private final PostService posts; private final CatalogService catalog;
 @GetMapping("/posts") public Page<PostSummary> posts(@RequestParam(required=false)String q,@RequestParam(required=false)String category,@RequestParam(required=false)String tag,@RequestParam(required=false)Boolean featured,@RequestParam(defaultValue="0")int page,@RequestParam(defaultValue="9")int size){return posts.publicPosts(q,category,tag,featured,page,size);}
 @GetMapping("/posts/{slug}") public PostResponse post(@PathVariable String slug){return posts.publicPost(slug);}
 @GetMapping("/categories") public List<TaxonomyResponse> categories(){return catalog.categories();}
 @GetMapping("/tags") public List<TaxonomyResponse> tags(){return catalog.tags();}
 @GetMapping("/projects") public List<ProjectResponse> projects(){return catalog.projects();}
}
