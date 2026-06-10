package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "appearance_settings")
public class AppearanceSettingsEntity {

    @Id
    private Long id;

    @Column(name = "accent_color", nullable = false, length = 7)
    private String accentColor;

    @Column(name = "logo_image_url", columnDefinition = "TEXT")
    private String logoImageUrl;

    @Column(name = "logo_svg_code", columnDefinition = "TEXT")
    private String logoSvgCode;

    @Column(name = "show_hero_logo")
    private Boolean showHeroLogo;

    public AppearanceSettingsEntity() {
    }

    public AppearanceSettingsEntity(
            Long id,
            String accentColor,
            String logoImageUrl,
            String logoSvgCode,
            Boolean showHeroLogo
    ) {
        this.id = id;
        this.accentColor = accentColor;
        this.logoImageUrl = logoImageUrl;
        this.logoSvgCode = logoSvgCode;
        this.showHeroLogo = showHeroLogo;
    }

    public Long getId() {
        return id;
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