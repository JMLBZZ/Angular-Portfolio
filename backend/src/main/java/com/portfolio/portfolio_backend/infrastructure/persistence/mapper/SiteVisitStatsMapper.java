package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.SiteVisitStats;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.SiteVisitStatsEntity;
import org.springframework.stereotype.Component;

@Component
public class SiteVisitStatsMapper {

    public SiteVisitStats toDomain(SiteVisitStatsEntity entity) {
        if (entity == null) {
            return new SiteVisitStats(0);
        }

        return new SiteVisitStats(entity.getTotalVisits());
    }
}