package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroTechBadgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaHeroTechBadgeRepository extends JpaRepository<HeroTechBadgeEntity, Long> {

    List<HeroTechBadgeEntity> findAllByOrderByDisplayOrderAscIdAsc();

    void deleteAll();
}