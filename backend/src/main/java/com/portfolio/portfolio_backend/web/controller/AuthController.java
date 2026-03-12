package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.UserService;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.UserEntity;
import com.portfolio.portfolio_backend.infrastructure.security.JwtProperties;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.dto.AuthResponse;
import com.portfolio.portfolio_backend.web.dto.LoginRequest;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthController(
            UserService userService,
            JwtService jwtService,
            JwtProperties jwtProperties
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        UserEntity user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse(
                token,
                "Bearer",
                jwtProperties.expirationMs(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }
}