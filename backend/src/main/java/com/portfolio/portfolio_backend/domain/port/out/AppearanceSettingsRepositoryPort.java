package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;

import java.util.Optional;

public interface AppearanceSettingsRepositoryPort {

    Optional<AppearanceSettings> find();

    AppearanceSettings save(AppearanceSettings appearanceSettings);
}