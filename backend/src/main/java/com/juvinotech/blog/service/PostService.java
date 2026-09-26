package com.juvinotech.blog.service;

import com.juvinotech.blog.domain.*;
import com.juvinotech.blog.dto.ApiDtos.*;
import com.juvinotech.blog.exception.ResourceNotFoundException;
import com.juvinotech.blog.repository.*;
import com.juvinotech.blog.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.*;

@Service @RequiredArgsConstructor
public class PostService {
    private final PostRepository posts; private final CategoryRepository categories; private final TagRepository tags; private final ProjectRepository projects;
    @Transactional(readOnly=true)
    public Page<PostSummary> publicPosts(String q,String category,String tag,Boolean featured,int page,int size){
        var spec=Specification.where(PostSpecifications.published()).and(PostSpecifications.search(q)).and(PostSpecifications.category(category)).and(PostSpecifications.tag(tag)).and(PostSpecifications.featured(featured));
        return posts.findAll(spec,PageRequest.of(Math.max(0,page),Math.min(Math.max(size,1),50),Sort.by(Sort.Direction.DESC,"publishedAt"))).map(BlogMapper::summary);
    }
    @Transactional(readOnly=true) public PostResponse publicPost(String slug){
        Post p=posts.findBySlugAndStatus(slug,Post.Status.PUBLISHED).orElseThrow(()->new ResourceNotFoundException("Artigo não encontrado"));
        List<Long> tagIds=p.getTags().stream().map(Tag::getId).toList();
        List<PostSummary> related=p.getCategory()==null||tagIds.isEmpty()?List.of():posts.findRelated(p.getId(),p.getCategory().getId(),tagIds).stream().limit(3).map(BlogMapper::summary).toList();
        return BlogMapper.post(p,related);
    }
    @Transactional(readOnly=true) public Page<PostSummary> adminPosts(int page,int size){return posts.findAll(PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"updatedAt"))).map(BlogMapper::summary);}
    @Transactional(readOnly=true) public PostResponse adminPost(Long id){return BlogMapper.post(find(id),List.of());}
    @Transactional public PostResponse create(PostRequest request){return BlogMapper.post(save(new Post(),request),List.of());}
    @Transactional public PostResponse update(Long id,PostRequest request){return BlogMapper.post(save(find(id),request),List.of());}
    @Transactional public void delete(Long id){posts.delete(find(id));}
    @Transactional public PostResponse publish(Long id,boolean publish){Post p=find(id);p.setStatus(publish?Post.Status.PUBLISHED:Post.Status.DRAFT);p.setPublishedAt(publish?(p.getPublishedAt()==null?Instant.now():p.getPublishedAt()):null);return BlogMapper.post(p,List.of());}
    @Transactional(readOnly=true) public DashboardResponse dashboard(){return new DashboardResponse(posts.count(),posts.countByStatus(Post.Status.PUBLISHED),posts.countByStatus(Post.Status.DRAFT),posts.findTop5ByOrderByCreatedAtDesc().stream().map(BlogMapper::summary).toList());}
    private Post save(Post p,PostRequest r){
        p.setTitle(r.title().trim()); p.setSlug(uniqueSlug(r.slug()==null||r.slug().isBlank()?r.title():r.slug(),p.getId())); p.setSummary(r.summary().trim()); p.setContent(r.content());
        p.setCoverImageUrl(blankToNull(r.coverImageUrl())); p.setFeatured(r.featured()); p.setCategory(categories.findById(r.categoryId()).orElseThrow(()->new ResourceNotFoundException("Categoria não encontrada")));
        p.setTags(new LinkedHashSet<>(r.tagIds()==null?List.of():tags.findAllByIdIn(r.tagIds()))); p.setProject(r.projectId()==null?null:projects.findById(r.projectId()).orElseThrow(()->new ResourceNotFoundException("Projeto não encontrado")));
        p.setReadingTime(ReadingTimeCalculator.calculate(r.content()));
        if(r.status()==Post.Status.PUBLISHED && p.getPublishedAt()==null)p.setPublishedAt(Instant.now()); if(r.status()==Post.Status.DRAFT)p.setPublishedAt(null); p.setStatus(r.status()); return posts.save(p);
    }
    private String uniqueSlug(String source,Long id){String base=SlugUtils.slugify(source),candidate=base;int n=2;while(id==null?posts.existsBySlug(candidate):posts.existsBySlugAndIdNot(candidate,id))candidate=base+"-"+n++;return candidate;}
    private Post find(Long id){return posts.findById(id).orElseThrow(()->new ResourceNotFoundException("Artigo não encontrado"));}
    private String blankToNull(String s){return s==null||s.isBlank()?null:s.trim();}
}
