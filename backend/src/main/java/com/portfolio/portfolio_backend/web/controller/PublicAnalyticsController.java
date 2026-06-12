package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.SiteVisitStatsService;
import com.portfolio.portfolio_backend.domain.model.SiteVisitStats;
import com.portfolio.portfolio_backend.web.dto.SiteVisitStatsResponseDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/analytics")
public class PublicAnalyticsController {

    private final SiteVisitStatsService siteVisitStatsService;

    public PublicAnalyticsController(SiteVisitStatsService siteVisitStatsService) {
        this.siteVisitStatsService = siteVisitStatsService;
    }

    @PostMapping("/visit")
    public SiteVisitStatsResponseDTO registerVisit() {
        return toResponse(siteVisitStatsService.registerVisit());
    }

    private SiteVisitStatsResponseDTO toResponse(SiteVisitStats stats) {
        return new SiteVisitStatsResponseDTO(stats.getTotalVisits());
    }
}