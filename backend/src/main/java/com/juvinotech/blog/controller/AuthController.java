package com.juvinotech.blog.controller;
import com.juvinotech.blog.dto.ApiDtos.*; import com.juvinotech.blog.service.AuthService; import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor public class AuthController {private final AuthService auth;@PostMapping("/login") public LoginResponse login(@Valid @RequestBody LoginRequest request){return auth.login(request);}}
