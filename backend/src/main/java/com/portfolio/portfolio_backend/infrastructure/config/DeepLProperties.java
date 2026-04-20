package com.portfolio.portfolio_backend.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.translation.deepl")
public record DeepLProperties(
        String authKey,
        String sourceLang,
        String targetLang
) {
}