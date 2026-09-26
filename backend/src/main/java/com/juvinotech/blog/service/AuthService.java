package com.juvinotech.blog.service;

import com.juvinotech.blog.dto.ApiDtos.*;
import com.juvinotech.blog.repository.UserRepository;
import com.juvinotech.blog.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public LoginResponse login(LoginRequest request){var user=users.findByEmailIgnoreCase(request.email()).orElseThrow(()->new BadCredentialsException("invalid"));if(!encoder.matches(request.password(),user.getPasswordHash()))throw new BadCredentialsException("invalid");return new LoginResponse(jwt.generate(user.getEmail()),"Bearer",jwt.expirationSeconds(),user.getName(),user.getEmail());}
}
