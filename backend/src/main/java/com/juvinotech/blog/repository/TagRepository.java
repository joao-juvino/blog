package com.juvinotech.blog.repository;
import com.juvinotech.blog.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TagRepository extends JpaRepository<Tag,Long>{ Optional<Tag> findBySlug(String slug); List<Tag> findAllByIdIn(Collection<Long> ids); boolean existsBySlug(String slug); }
