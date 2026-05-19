package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.domain.port.out.AppearanceSettingsRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppearanceSettingsService {

    public static final String DEFAULT_ACCENT_COLOR = "#c5a567";

    private final AppearanceSettingsRepositoryPort appearanceSettingsRepositoryPort;

    public AppearanceSettingsService(AppearanceSettingsRepositoryPort appearanceSettingsRepositoryPort) {
        this.appearanceSettingsRepositoryPort = appearanceSettingsRepositoryPort;
    }

    @Transactional(readOnly = true)
    public AppearanceSettings getSettings() {
        return appearanceSettingsRepositoryPort
                .find()
                .orElseGet(this::getDefaultSettings);
    }

    @Transactional
    public AppearanceSettings updateSettings(String accentColor) {
        String normalizedAccentColor = normalizeAccentColor(accentColor);

        AppearanceSettings appearanceSettings = new AppearanceSettings(normalizedAccentColor);

        return appearanceSettingsRepositoryPort.save(appearanceSettings);
    }

    @Transactional
    public AppearanceSettings resetToDefault() {
        AppearanceSettings appearanceSettings = getDefaultSettings();

        return appearanceSettingsRepositoryPort.save(appearanceSettings);
    }

    public AppearanceSettings getDefaultSettings() {
        return new AppearanceSettings(DEFAULT_ACCENT_COLOR);
    }

    private String normalizeAccentColor(String accentColor) {
        if (accentColor == null || accentColor.isBlank()) {
            throw new IllegalArgumentException("La couleur principale est obligatoire.");
        }

        String normalizedAccentColor = accentColor.trim().toLowerCase();

        if (!normalizedAccentColor.matches("^#[0-9a-f]{6}$")) {
            throw new IllegalArgumentException("La couleur principale doit être au format hexadécimal #RRGGBB.");
        }

        return normalizedAccentColor;
    }
}