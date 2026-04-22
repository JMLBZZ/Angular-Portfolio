package com.portfolio.portfolio_backend.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.translation.rate-limit")
public record TranslationRateLimitProperties(
        boolean enabled,
        int maxRequests,
        long windowSeconds
) {
}