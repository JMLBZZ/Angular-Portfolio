package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.AppearanceSettingsService;
import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.web.dto.AppearanceSettingsResponseDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/appearance")
public class PublicAppearanceSettingsController {

    private final AppearanceSettingsService appearanceSettingsService;

    public PublicAppearanceSettingsController(AppearanceSettingsService appearanceSettingsService) {
        this.appearanceSettingsService = appearanceSettingsService;
    }

    @GetMapping
    public AppearanceSettingsResponseDTO get() {
        return toResponse(appearanceSettingsService.getSettings());
    }

    private AppearanceSettingsResponseDTO toResponse(AppearanceSettings appearanceSettings) {
        return new AppearanceSettingsResponseDTO(
                appearanceSettings.getAccentColor(),
                appearanceSettings.getLogoImageUrl(),
                appearanceSettings.getLogoSvgCode(),
                appearanceSettings.isShowHeroLogo()
        );
    }
}