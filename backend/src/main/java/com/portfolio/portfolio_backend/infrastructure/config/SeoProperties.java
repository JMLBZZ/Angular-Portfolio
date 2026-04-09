package com.portfolio.portfolio_backend.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.seo")
public record SeoProperties(
        String publicBaseUrl
) {
}