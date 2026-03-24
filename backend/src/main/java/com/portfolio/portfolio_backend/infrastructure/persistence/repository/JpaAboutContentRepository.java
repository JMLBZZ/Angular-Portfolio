package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.AboutContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaAboutContentRepository extends JpaRepository<AboutContentEntity, Long> {
}