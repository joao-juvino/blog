package com.juvinotech.blog.service;

import com.juvinotech.blog.domain.*;
import com.juvinotech.blog.dto.ApiDtos.*;
import java.util.*;

public final class BlogMapper {
    private BlogMapper(){}
    public static TaxonomyResponse taxonomy(Category c){return c==null?null:new TaxonomyResponse(c.getId(),c.getName(),c.getSlug());}
    public static TaxonomyResponse taxonomy(Tag t){return new TaxonomyResponse(t.getId(),t.getName(),t.getSlug());}
    public static ProjectResponse project(Project p){return p==null?null:new ProjectResponse(p.getId(),p.getName(),p.getSlug(),p.getDescription(),p.getImageUrl(),p.getGithubUrl(),p.getDemoUrl(),split(p.getTechnologies()));}
    public static PostSummary summary(Post p){return new PostSummary(p.getId(),p.getTitle(),p.getSlug(),p.getSummary(),p.getCoverImageUrl(),p.getStatus(),p.isFeatured(),p.getPublishedAt(),p.getReadingTime(),taxonomy(p.getCategory()),p.getTags().stream().map(BlogMapper::taxonomy).toList());}
    public static PostResponse post(Post p,List<PostSummary> related){return new PostResponse(p.getId(),p.getTitle(),p.getSlug(),p.getSummary(),p.getContent(),p.getCoverImageUrl(),p.getStatus(),p.isFeatured(),p.getCreatedAt(),p.getUpdatedAt(),p.getPublishedAt(),p.getReadingTime(),taxonomy(p.getCategory()),p.getTags().stream().map(BlogMapper::taxonomy).toList(),project(p.getProject()),related);}
    private static List<String> split(String text){return text==null||text.isBlank()?List.of():Arrays.stream(text.split(",")).map(String::trim).filter(s->!s.isBlank()).toList();}
}
