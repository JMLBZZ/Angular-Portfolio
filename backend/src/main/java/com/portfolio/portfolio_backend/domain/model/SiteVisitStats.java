package com.portfolio.portfolio_backend.domain.model;

public class SiteVisitStats {

    private long totalVisits;

    public SiteVisitStats(long totalVisits) {
        this.totalVisits = Math.max(0, totalVisits);
    }

    public long getTotalVisits() {
        return totalVisits;
    }
}