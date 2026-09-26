package com.juvinotech.blog.service;

import com.juvinotech.blog.domain.Post;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public final class PostSpecifications {
    private PostSpecifications(){}
    public static Specification<Post> published(){return (r,q,b)->b.equal(r.get("status"),Post.Status.PUBLISHED);}
    public static Specification<Post> search(String term){return (r,q,b)->{ if(term==null||term.isBlank())return b.conjunction(); String p="%"+term.toLowerCase()+"%"; return b.or(b.like(b.lower(r.get("title")),p),b.like(b.lower(r.get("summary")),p),b.like(b.lower(r.get("content")),p));};}
    public static Specification<Post> category(String slug){return (r,q,b)->slug==null||slug.isBlank()?b.conjunction():b.equal(r.join("category",JoinType.LEFT).get("slug"),slug);}
    public static Specification<Post> tag(String slug){return (r,q,b)->{if(slug==null||slug.isBlank())return b.conjunction();q.distinct(true);return b.equal(r.join("tags",JoinType.LEFT).get("slug"),slug);};}
    public static Specification<Post> featured(Boolean value){return (r,q,b)->value==null?b.conjunction():b.equal(r.get("featured"),value);}
}
