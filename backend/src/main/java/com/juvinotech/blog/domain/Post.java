package com.juvinotech.blog.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity @Table(name="posts") @Getter @Setter @NoArgsConstructor
public class Post extends BaseEntity {
    @Column(nullable=false,length=180) private String title;
    @Column(nullable=false,unique=true,length=220) private String slug;
    @Column(nullable=false,length=400) private String summary;
    @Column(nullable=false,columnDefinition="text") private String content;
    @Column(length=500) private String coverImageUrl;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Status status=Status.DRAFT;
    @Column(nullable=false) private boolean featured;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="category_id") private Category category;
    @ManyToMany(fetch=FetchType.LAZY)
    @JoinTable(name="posts_tags",joinColumns=@JoinColumn(name="post_id"),inverseJoinColumns=@JoinColumn(name="tag_id"))
    private Set<Tag> tags=new LinkedHashSet<>();
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="project_id") private Project project;
    private Instant publishedAt;
    @Column(nullable=false) private int readingTime=1;
    public enum Status { DRAFT, PUBLISHED }
}
