package com.juvinotech.blog.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor
public class User extends BaseEntity {
    @Column(nullable=false,length=120) private String name;
    @Column(nullable=false,unique=true,length=180) private String email;
    @Column(name="password_hash",nullable=false) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private Role role=Role.ADMIN;
    public enum Role { ADMIN }
}
