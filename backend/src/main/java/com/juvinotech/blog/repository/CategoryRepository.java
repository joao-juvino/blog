package com.juvinotech.blog.repository;
import com.juvinotech.blog.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface CategoryRepository extends JpaRepository<Category,Long>{ Optional<Category> findBySlug(String slug); boolean existsBySlug(String slug); }
