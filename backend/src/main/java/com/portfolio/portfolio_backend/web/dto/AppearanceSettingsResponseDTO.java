package com.portfolio.portfolio_backend.web.dto;

public class AppearanceSettingsResponseDTO {

    private String accentColor;

    public AppearanceSettingsResponseDTO(String accentColor) {
        this.accentColor = accentColor;
    }

    public String getAccentColor() {
        return accentColor;
    }
}