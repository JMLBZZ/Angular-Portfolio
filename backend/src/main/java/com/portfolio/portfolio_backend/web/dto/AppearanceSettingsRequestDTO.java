package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AppearanceSettingsRequestDTO {

    @NotBlank(message = "La couleur principale est obligatoire")
    @Pattern(
            regexp = "^#[0-9A-Fa-f]{6}$",
            message = "La couleur principale doit être au format hexadécimal #RRGGBB"
    )
    private String accentColor;

    public AppearanceSettingsRequestDTO() {
    }

    public String getAccentColor() {
        return accentColor;
    }
}