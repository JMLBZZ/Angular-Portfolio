package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AppearanceSettingsRequestDTO {

    @NotBlank(message = "La couleur principale est obligatoire")
    @Pattern(
            regexp = "^#[0-9A-Fa-f]{6}$",
            message = "La couleur principale doit être au format hexadécimal #RRGGBB"
    )
    private String accentColor;

    @Size(max = 1000, message = "L'URL du logo est trop longue")
    private String logoImageUrl;

    @Size(max = 20000, message = "Le code SVG du logo est trop long")
    private String logoSvgCode;

    private Boolean showHeroLogo;

    public AppearanceSettingsRequestDTO() {
    }

    public String getAccentColor() {
        return accentColor;
    }

    public String getLogoImageUrl() {
        return logoImageUrl;
    }

    public String getLogoSvgCode() {
        return logoSvgCode;
    }

    public Boolean getShowHeroLogo() {
        return showHeroLogo;
    }
}