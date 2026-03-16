package com.portfolio.portfolio_backend.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.upload")
public record UploadProperties(
        String dir,
        String projectsSubdir
) {
}