package com.portfolio.portfolio_backend.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.seed-admin")
public record SeedAdminProperties(
        boolean enabled,
        String email,
        String password
) {}
