package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "hero_entity")
public class HeroEntity {

    @Id
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitleEn;

    @Column(nullable = false)
    private boolean available;

    public HeroEntity() {
    }

    public HeroEntity(
            Long id,
            String titleFr,
            String titleEn,
            String subtitleFr,
            String subtitleEn,
            boolean available
    ) {
        this.id = id;
        this.titleFr = titleFr;
        this.titleEn = titleEn;
        this.subtitleFr = subtitleFr;
        this.subtitleEn = subtitleEn;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public String getSubtitleFr() {
        return subtitleFr;
    }

    public String getSubtitleEn() {
        return subtitleEn;
    }

    public boolean isAvailable() {
        return available;
    }
}