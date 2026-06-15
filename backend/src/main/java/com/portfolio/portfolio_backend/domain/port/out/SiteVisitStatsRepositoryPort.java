package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.SiteVisitStats;

public interface SiteVisitStatsRepositoryPort {

    SiteVisitStats incrementTotalVisits();

    SiteVisitStats getStats();

    SiteVisitStats resetVisits();
}