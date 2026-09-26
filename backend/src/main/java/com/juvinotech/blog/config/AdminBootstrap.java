package com.juvinotech.blog.config;

import com.juvinotech.blog.domain.User;
import com.juvinotech.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrap implements ApplicationRunner {
    private final UserRepository users; private final PasswordEncoder encoder; private final String name,email,password;
    public AdminBootstrap(UserRepository users,PasswordEncoder encoder,@Value("${app.admin.name}")String name,@Value("${app.admin.email}")String email,@Value("${app.admin.password}")String password){this.users=users;this.encoder=encoder;this.name=name;this.email=email;this.password=password;}
    @Override @Transactional public void run(ApplicationArguments args){if(email==null||email.isBlank()||password==null||password.length()<10||users.findByEmailIgnoreCase(email).isPresent())return;var u=new User();u.setName(name);u.setEmail(email.toLowerCase());u.setPasswordHash(encoder.encode(password));u.setRole(User.Role.ADMIN);users.save(u);}
}
