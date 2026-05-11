package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.LegalContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaLegalContentRepository extends JpaRepository<LegalContentEntity, Long> {
}