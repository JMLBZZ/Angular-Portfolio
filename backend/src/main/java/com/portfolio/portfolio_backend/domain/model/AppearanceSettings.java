package com.portfolio.portfolio_backend.domain.model;

public class AppearanceSettings {

    private String accentColor;
    private String logoImageUrl;
    private String logoSvgCode;
    private boolean showHeroLogo;

    public AppearanceSettings(String accentColor, String logoImageUrl, String logoSvgCode) {
        this(accentColor, logoImageUrl, logoSvgCode, true);
    }

    public AppearanceSettings(
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