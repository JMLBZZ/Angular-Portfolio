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

    public AppearanceSettingsEntity() {
    }

    public AppearanceSettingsEntity(Long id, String accentColor) {
        this.id = id;
        this.accentColor = accentColor;
    }

    public Long getId() {
        return id;
    }

    public String getAccentColor() {
        return accentColor;
    }
}