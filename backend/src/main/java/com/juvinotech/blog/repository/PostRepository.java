package com.juvinotech.blog.repository;

import com.juvinotech.blog.domain.Post;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface PostRepository extends JpaRepository<Post,Long>, JpaSpecificationExecutor<Post> {
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
    @EntityGraph(attributePaths={"category","tags","project"}) Optional<Post> findBySlugAndStatus(String slug, Post.Status status);
    @Override @EntityGraph(attributePaths={"category","tags","project"}) Page<Post> findAll(Specification<Post> specification, Pageable pageable);
    long countByStatus(Post.Status status);
    List<Post> findTop5ByOrderByCreatedAtDesc();
    @Query("select distinct p from Post p left join fetch p.category left join fetch p.tags where p.status='PUBLISHED' and p.id<>:id and (p.category.id=:categoryId or exists(select t from p.tags t where t.id in :tagIds)) order by p.publishedAt desc")
    List<Post> findRelated(@Param("id") Long id,@Param("categoryId") Long categoryId,@Param("tagIds") Collection<Long> tagIds);
}
