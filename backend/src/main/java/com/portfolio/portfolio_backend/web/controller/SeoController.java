package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.RobotsService;
import com.portfolio.portfolio_backend.application.service.SitemapService;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
public class SeoController {

    private final SitemapService sitemapService;
    private final RobotsService robotsService;

    public SeoController(
            SitemapService sitemapService,
            RobotsService robotsService
    ) {
        this.sitemapService = sitemapService;
        this.robotsService = robotsService;
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemap() {
        String xml = sitemapService.generateSitemapXml();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic())
                .contentType(MediaType.APPLICATION_XML)
                .body(xml);
    }

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getRobotsTxt() {
        String robotsTxt = robotsService.generateRobotsTxt();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic())
                .contentType(MediaType.TEXT_PLAIN)
                .body(robotsTxt);
    }
}