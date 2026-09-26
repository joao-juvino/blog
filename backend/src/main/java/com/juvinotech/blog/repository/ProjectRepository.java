package com.juvinotech.blog.repository;
import com.juvinotech.blog.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ProjectRepository extends JpaRepository<Project,Long>{ Optional<Project> findBySlug(String slug); boolean existsBySlug(String slug); }
