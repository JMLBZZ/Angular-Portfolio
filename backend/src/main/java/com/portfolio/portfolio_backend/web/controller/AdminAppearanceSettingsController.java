package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.AppearanceSettingsService;
import com.portfolio.portfolio_backend.domain.model.AppearanceSettings;
import com.portfolio.portfolio_backend.web.dto.AppearanceSettingsRequestDTO;
import com.portfolio.portfolio_backend.web.dto.AppearanceSettingsResponseDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/appearance")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAppearanceSettingsController {

    private final AppearanceSettingsService appearanceSettingsService;

    public AdminAppearanceSettingsController(AppearanceSettingsService appearanceSettingsService) {
        this.appearanceSettingsService = appearanceSettingsService;
    }

    @GetMapping
    public AppearanceSettingsResponseDTO get() {
        return toResponse(appearanceSettingsService.getSettings());
    }

    @PutMapping
    public AppearanceSettingsResponseDTO update(@Valid @RequestBody AppearanceSettingsRequestDTO dto) {
        AppearanceSettings updatedSettings = appearanceSettingsService.updateSettings(dto.getAccentColor());

        return toResponse(updatedSettings);
    }

    @PostMapping("/reset")
    public AppearanceSettingsResponseDTO reset() {
        AppearanceSettings resetSettings = appearanceSettingsService.resetToDefault();

        return toResponse(resetSettings);
    }

    private AppearanceSettingsResponseDTO toResponse(AppearanceSettings appearanceSettings) {
        return new AppearanceSettingsResponseDTO(
                appearanceSettings.getAccentColor()
        );
    }
}