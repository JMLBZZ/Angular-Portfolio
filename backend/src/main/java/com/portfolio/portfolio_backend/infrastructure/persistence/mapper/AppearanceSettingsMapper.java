package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.AppearanceSettingsEntity;
import org.springframework.stereotype.Component;

@Component
public class AppearanceSettingsMapper {

    public AppearanceSettingsEntity toEntity(AppearanceSettings appearanceSettings) {
        if (appearanceSettings == null) {
            return null;
        }

        return new AppearanceSettingsEntity(
                1L,
                appearanceSettings.getAccentColor()
        );
    }

    public AppearanceSettings toDomain(AppearanceSettingsEntity entity) {
        if (entity == null) {
            return null;
        }

        return new AppearanceSettings(
                entity.getAccentColor()
        );
    }
}