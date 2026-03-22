package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ResumeContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaResumeContentRepository extends JpaRepository<ResumeContentEntity, Long> {
}