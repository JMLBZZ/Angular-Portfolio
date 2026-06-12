package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.SiteVisitStatsEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JpaSiteVisitStatsRepository extends JpaRepository<SiteVisitStatsEntity, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select stats from SiteVisitStatsEntity stats where stats.id = :id")
    Optional<SiteVisitStatsEntity> findByIdForUpdate(@Param("id") Long id);
}