package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.config.SeoProperties;

import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class SitemapService {

    private final ProjectService projectService;
    private final SeoProperties seoProperties;

    public SitemapService(
            ProjectService projectService,
            SeoProperties seoProperties
    ) {
        this.projectService = projectService;
        this.seoProperties = seoProperties;
    }

    public String generateSitemapXml() {
        String baseUrl = normalizeBaseUrl(seoProperties.publicBaseUrl());

        List<String> urls = new ArrayList<>();
        urls.add(baseUrl + "/");

        for (Project project : projectService.getPublishedProjects()) {
            String slug = project.getSlug();

            if (slug == null || slug.isBlank()) {
                continue;
            }

            String encodedSlug = UriUtils.encodePathSegment(slug.trim(), StandardCharsets.UTF_8);
            urls.add(baseUrl + "/projects/" + encodedSlug);
        }

        StringBuilder xml = new StringBuilder();

        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        for (String url : urls) {
            xml.append("  <url>\n");
            xml.append("    <loc>").append(escapeXml(url)).append("</loc>\n");
            xml.append("  </url>\n");
        }

        xml.append("</urlset>\n");

        return xml.toString();
    }

    private String normalizeBaseUrl(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("app.seo.public-base-url must be configured.");
        }

        return value.trim().replaceAll("/+$", "");
    }

    private String escapeXml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}