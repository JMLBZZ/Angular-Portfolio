package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroCardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaHeroCardRepository extends JpaRepository<HeroCardEntity, Long> {
}