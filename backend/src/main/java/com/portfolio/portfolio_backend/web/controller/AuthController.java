package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.UserService;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.UserEntity;
import com.portfolio.portfolio_backend.infrastructure.security.JwtService;
import com.portfolio.portfolio_backend.web.dto.LoginRequest;
import com.portfolio.portfolio_backend.web.dto.RegisterRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        UserEntity user = userService.register(
                request.getEmail(),
                request.getPassword());

        return ResponseEntity.ok(user.getEmail());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        userService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(request.getEmail());

        return ResponseEntity.ok(token);
    }

}
