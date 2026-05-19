package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.AppearanceSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaAppearanceSettingsRepository extends JpaRepository<AppearanceSettingsEntity, Long> {
}