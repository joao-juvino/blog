package com.juvinotech.blog.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="projects") @Getter @Setter @NoArgsConstructor
public class Project {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=120) private String name;
    @Column(nullable=false,unique=true,length=140) private String slug;
    @Column(nullable=false,length=600) private String description;
    @Column(length=500) private String imageUrl;
    @Column(length=500) private String githubUrl;
    @Column(length=500) private String demoUrl;
    @Column(nullable=false,length=500) private String technologies="";
}
