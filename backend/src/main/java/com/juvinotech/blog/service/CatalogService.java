package com.juvinotech.blog.service;

import com.juvinotech.blog.domain.*;
import com.juvinotech.blog.dto.ApiDtos.*;
import com.juvinotech.blog.exception.*;
import com.juvinotech.blog.repository.*;
import com.juvinotech.blog.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class CatalogService {
    private final CategoryRepository categories; private final TagRepository tags; private final ProjectRepository projects;
    @Transactional(readOnly=true) public List<TaxonomyResponse> categories(){return categories.findAll().stream().map(BlogMapper::taxonomy).toList();}
    @Transactional(readOnly=true) public List<TaxonomyResponse> tags(){return tags.findAll().stream().map(BlogMapper::taxonomy).toList();}
    @Transactional(readOnly=true) public List<ProjectResponse> projects(){return projects.findAll().stream().map(BlogMapper::project).toList();}
    @Transactional public TaxonomyResponse saveCategory(Long id,TaxonomyRequest r){Category c=id==null?new Category():categories.findById(id).orElseThrow(()->new ResourceNotFoundException("Categoria não encontrada"));c.setName(r.name().trim());c.setSlug(SlugUtils.slugify(r.slug()==null||r.slug().isBlank()?r.name():r.slug()));return BlogMapper.taxonomy(categories.save(c));}
    @Transactional public TaxonomyResponse saveTag(Long id,TaxonomyRequest r){Tag t=id==null?new Tag():tags.findById(id).orElseThrow(()->new ResourceNotFoundException("Tag não encontrada"));t.setName(r.name().trim());t.setSlug(SlugUtils.slugify(r.slug()==null||r.slug().isBlank()?r.name():r.slug()));return BlogMapper.taxonomy(tags.save(t));}
    @Transactional public ProjectResponse saveProject(Long id,ProjectRequest r){Project p=id==null?new Project():projects.findById(id).orElseThrow(()->new ResourceNotFoundException("Projeto não encontrado"));p.setName(r.name().trim());p.setSlug(SlugUtils.slugify(r.slug()==null||r.slug().isBlank()?r.name():r.slug()));p.setDescription(r.description().trim());p.setImageUrl(r.imageUrl());p.setGithubUrl(r.githubUrl());p.setDemoUrl(r.demoUrl());p.setTechnologies(r.technologies()==null?"":String.join(", ",r.technologies()));return BlogMapper.project(projects.save(p));}
    @Transactional public void deleteCategory(Long id){categories.deleteById(id);}
    @Transactional public void deleteTag(Long id){tags.deleteById(id);}
    @Transactional public void deleteProject(Long id){projects.deleteById(id);}
}
