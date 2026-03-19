package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaHeroRepository extends JpaRepository<HeroEntity, Long> {
}