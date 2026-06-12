package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.SiteVisitStats;
import com.portfolio.portfolio_backend.domain.port.out.SiteVisitStatsRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.SiteVisitStatsEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.SiteVisitStatsMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaSiteVisitStatsRepository;
import org.springframework.stereotype.Repository;

@Repository
public class SiteVisitStatsRepositoryAdapter implements SiteVisitStatsRepositoryPort {

    private static final long SITE_VISIT_STATS_ID = 1L;

    private final JpaSiteVisitStatsRepository jpaSiteVisitStatsRepository;
    private final SiteVisitStatsMapper siteVisitStatsMapper;

    public SiteVisitStatsRepositoryAdapter(
            JpaSiteVisitStatsRepository jpaSiteVisitStatsRepository,
            SiteVisitStatsMapper siteVisitStatsMapper
    ) {
        this.jpaSiteVisitStatsRepository = jpaSiteVisitStatsRepository;
        this.siteVisitStatsMapper = siteVisitStatsMapper;
    }

    @Override
    public SiteVisitStats getStats() {
        return jpaSiteVisitStatsRepository
                .findById(SITE_VISIT_STATS_ID)
                .map(siteVisitStatsMapper::toDomain)
                .orElseGet(() -> new SiteVisitStats(0));
    }

    @Override
    public SiteVisitStats incrementTotalVisits() {
        SiteVisitStatsEntity entity = jpaSiteVisitStatsRepository
                .findByIdForUpdate(SITE_VISIT_STATS_ID)
                .orElseGet(() -> new SiteVisitStatsEntity(SITE_VISIT_STATS_ID, 0));

        entity.incrementTotalVisits();

        SiteVisitStatsEntity savedEntity = jpaSiteVisitStatsRepository.save(entity);

        return siteVisitStatsMapper.toDomain(savedEntity);
    }
}