package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "site_visit_stats")
public class SiteVisitStatsEntity {

    @Id
    private Long id;

    @Column(name = "total_visits", nullable = false)
    private long totalVisits;

    public SiteVisitStatsEntity() {
    }

    public SiteVisitStatsEntity(Long id, long totalVisits) {
        this.id = id;
        this.totalVisits = Math.max(0, totalVisits);
    }

    public Long getId() {
        return id;
    }

    public long getTotalVisits() {
        return totalVisits;
    }

    public void incrementTotalVisits() {
        this.totalVisits++;
    }
}