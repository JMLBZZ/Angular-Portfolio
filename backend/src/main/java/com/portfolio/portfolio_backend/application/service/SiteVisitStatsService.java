package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.SiteVisitStats;
import com.portfolio.portfolio_backend.domain.port.out.SiteVisitStatsRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteVisitStatsService {

    private final SiteVisitStatsRepositoryPort siteVisitStatsRepositoryPort;

    public SiteVisitStatsService(SiteVisitStatsRepositoryPort siteVisitStatsRepositoryPort) {
        this.siteVisitStatsRepositoryPort = siteVisitStatsRepositoryPort;
    }

    @Transactional(readOnly = true)
    public SiteVisitStats getStats() {
        return siteVisitStatsRepositoryPort.getStats();
    }

    @Transactional
    public SiteVisitStats registerVisit() {
        return siteVisitStatsRepositoryPort.incrementTotalVisits();
    }
}