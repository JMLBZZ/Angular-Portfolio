package com.portfolio.portfolio_backend.domain.model;

public class AppearanceSettings {

    private String accentColor;

    public AppearanceSettings(String accentColor) {
        this.accentColor = accentColor;
    }

    public String getAccentColor() {
        return accentColor;
    }
}