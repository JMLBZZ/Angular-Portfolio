package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.infrastructure.config.SeoProperties;
import org.springframework.stereotype.Service;

@Service
public class RobotsService {

    private final SeoProperties seoProperties;

    public RobotsService(SeoProperties seoProperties) {
        this.seoProperties = seoProperties;
    }

    public String generateRobotsTxt() {
        String baseUrl = normalizeBaseUrl(seoProperties.publicBaseUrl());

        return """
                User-agent: *
                Allow: /
                Disallow: /admin
                Disallow: /admin/
                Disallow: /admin/login

                Sitemap: %s/sitemap.xml
                """.formatted(baseUrl);
    }

    private String normalizeBaseUrl(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("app.seo.public-base-url must be configured.");
        }

        return value.trim().replaceAll("/+$", "");
    }
}