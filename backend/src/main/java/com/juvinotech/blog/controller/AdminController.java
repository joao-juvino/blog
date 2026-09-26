package com.juvinotech.blog.controller;

import com.juvinotech.blog.dto.ApiDtos.*; import com.juvinotech.blog.service.*; import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.data.domain.Page; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import org.springframework.web.multipart.MultipartFile; import java.io.IOException; import java.util.List;
@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
 private final PostService posts; private final CatalogService catalog; private final StorageService storage;
 @GetMapping("/dashboard") DashboardResponse dashboard(){return posts.dashboard();}
 @GetMapping("/posts") Page<PostSummary> posts(@RequestParam(defaultValue="0")int page,@RequestParam(defaultValue="20")int size){return posts.adminPosts(page,size);}
 @GetMapping("/posts/{id}") PostResponse post(@PathVariable Long id){return posts.adminPost(id);}
 @PostMapping("/posts") @ResponseStatus(HttpStatus.CREATED) PostResponse create(@Valid @RequestBody PostRequest r){return posts.create(r);}
 @PutMapping("/posts/{id}") PostResponse update(@PathVariable Long id,@Valid @RequestBody PostRequest r){return posts.update(id,r);}
 @PatchMapping("/posts/{id}/publication") PostResponse publication(@PathVariable Long id,@RequestParam boolean published){return posts.publish(id,published);}
 @DeleteMapping("/posts/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void delete(@PathVariable Long id){posts.delete(id);}
 @PostMapping("/categories") TaxonomyResponse createCategory(@Valid @RequestBody TaxonomyRequest r){return catalog.saveCategory(null,r);}
 @PutMapping("/categories/{id}") TaxonomyResponse updateCategory(@PathVariable Long id,@Valid @RequestBody TaxonomyRequest r){return catalog.saveCategory(id,r);}
 @DeleteMapping("/categories/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void deleteCategory(@PathVariable Long id){catalog.deleteCategory(id);}
 @PostMapping("/tags") TaxonomyResponse createTag(@Valid @RequestBody TaxonomyRequest r){return catalog.saveTag(null,r);}
 @PutMapping("/tags/{id}") TaxonomyResponse updateTag(@PathVariable Long id,@Valid @RequestBody TaxonomyRequest r){return catalog.saveTag(id,r);}
 @DeleteMapping("/tags/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void deleteTag(@PathVariable Long id){catalog.deleteTag(id);}
 @PostMapping("/projects") ProjectResponse createProject(@Valid @RequestBody ProjectRequest r){return catalog.saveProject(null,r);}
 @PutMapping("/projects/{id}") ProjectResponse updateProject(@PathVariable Long id,@Valid @RequestBody ProjectRequest r){return catalog.saveProject(id,r);}
 @DeleteMapping("/projects/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void deleteProject(@PathVariable Long id){catalog.deleteProject(id);}
 @PostMapping(value="/uploads",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) UploadResponse upload(@RequestPart("file")MultipartFile file)throws IOException{return storage.upload(file);}
}
