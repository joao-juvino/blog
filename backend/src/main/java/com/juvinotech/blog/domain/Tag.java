package com.juvinotech.blog.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="tags") @Getter @Setter @NoArgsConstructor
public class Tag {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true,length=80) private String name;
    @Column(nullable=false,unique=true,length=100) private String slug;
}
