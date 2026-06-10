package com.portfolio.portfolio_backend.web.dto;

public class AppearanceSettingsResponseDTO {

    private String accentColor;
    private String logoImageUrl;
    private String logoSvgCode;
    private boolean showHeroLogo;

    public AppearanceSettingsResponseDTO(
            String accentColor,
            String logoImageUrl,
            String logoSvgCode,
            boolean showHeroLogo
    ) {
        this.accentColor = accentColor;
        this.logoImageUrl = logoImageUrl;
        this.logoSvgCode = logoSvgCode;
        this.showHeroLogo = showHeroLogo;
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

    public boolean isShowHeroLogo() {
        return showHeroLogo;
    }
}