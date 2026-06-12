package com.portfolio.portfolio_backend.web.dto;

public class SiteVisitStatsResponseDTO {

    private long totalVisits;

    public SiteVisitStatsResponseDTO(long totalVisits) {
        this.totalVisits = totalVisits;
    }

    public long getTotalVisits() {
        return totalVisits;
    }
}