package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.SiteVisitStatsService;
import com.portfolio.portfolio_backend.domain.model.SiteVisitStats;
import com.portfolio.portfolio_backend.web.dto.SiteVisitStatsResponseDTO;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final SiteVisitStatsService siteVisitStatsService;

    public AdminAnalyticsController(SiteVisitStatsService siteVisitStatsService) {
        this.siteVisitStatsService = siteVisitStatsService;
    }

    @GetMapping("/visits")
    public SiteVisitStatsResponseDTO getVisitStats() {
        return toResponse(siteVisitStatsService.getStats());
    }

    @PostMapping("/visits/reset")
    public SiteVisitStatsResponseDTO resetVisitStats() {
        return toResponse(siteVisitStatsService.resetVisits());
    }

    private SiteVisitStatsResponseDTO toResponse(SiteVisitStats stats) {
        return new SiteVisitStatsResponseDTO(stats.getTotalVisits());
    }
}