package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "hero_card_entity")
public class HeroCardEntity {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "title_fr", nullable = false, columnDefinition = "TEXT")
    private String titleFr;

    @Column(name = "title_en", nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(name = "subtitle_fr", nullable = false, columnDefinition = "TEXT")
    private String subtitleFr;

    @Column(name = "subtitle_en", nullable = false, columnDefinition = "TEXT")
    private String subtitleEn;

    @Column(name = "badge_fr", nullable = false, columnDefinition = "TEXT")
    private String badgeFr;

    @Column(name = "badge_en", nullable = false, columnDefinition = "TEXT")
    private String badgeEn;

    @Column(name = "highlight1_fr", nullable = false, columnDefinition = "TEXT")
    private String highlight1Fr;

    @Column(name = "highlight1_en", nullable = false, columnDefinition = "TEXT")
    private String highlight1En;

    @Column(name = "highlight2_fr", nullable = false, columnDefinition = "TEXT")
    private String highlight2Fr;

    @Column(name = "highlight2_en", nullable = false, columnDefinition = "TEXT")
    private String highlight2En;

    @Column(name = "highlight3_fr", nullable = false, columnDefinition = "TEXT")
    private String highlight3Fr;

    @Column(name = "highlight3_en", nullable = false, columnDefinition = "TEXT")
    private String highlight3En;

    @Column(name = "stat1_label_fr", nullable = false, columnDefinition = "TEXT")
    private String stat1LabelFr;

    @Column(name = "stat1_label_en", nullable = false, columnDefinition = "TEXT")
    private String stat1LabelEn;

    @Column(name = "stat1_value", nullable = false, columnDefinition = "TEXT")
    private String stat1Value;

    @Column(name = "stat2_label_fr", nullable = false, columnDefinition = "TEXT")
    private String stat2LabelFr;

    @Column(name = "stat2_label_en", nullable = false, columnDefinition = "TEXT")
    private String stat2LabelEn;

    @Column(name = "stat2_value", nullable = false, columnDefinition = "TEXT")
    private String stat2Value;

    @Column(name = "stat3_label_fr", nullable = false, columnDefinition = "TEXT")
    private String stat3LabelFr;

    @Column(name = "stat3_label_en", nullable = false, columnDefinition = "TEXT")
    private String stat3LabelEn;

    @Column(name = "stat3_value", nullable = false, columnDefinition = "TEXT")
    private String stat3Value;

    public HeroCardEntity() {
    }

    public HeroCardEntity(
            Long id,
            String titleFr,
            String titleEn,
            String subtitleFr,
            String subtitleEn,
            String badgeFr,
            String badgeEn,
            String highlight1Fr,
            String highlight1En,
            String highlight2Fr,
            String highlight2En,
            String highlight3Fr,
            String highlight3En,
            String stat1LabelFr,
            String stat1LabelEn,
            String stat1Value,
            String stat2LabelFr,
            String stat2LabelEn,
            String stat2Value,
            String stat3LabelFr,
            String stat3LabelEn,
            String stat3Value
    ) {
        this.id = id;
        this.titleFr = titleFr;
        this.titleEn = titleEn;
        this.subtitleFr = subtitleFr;
        this.subtitleEn = subtitleEn;
        this.badgeFr = badgeFr;
        this.badgeEn = badgeEn;
        this.highlight1Fr = highlight1Fr;
        this.highlight1En = highlight1En;
        this.highlight2Fr = highlight2Fr;
        this.highlight2En = highlight2En;
        this.highlight3Fr = highlight3Fr;
        this.highlight3En = highlight3En;
        this.stat1LabelFr = stat1LabelFr;
        this.stat1LabelEn = stat1LabelEn;
        this.stat1Value = stat1Value;
        this.stat2LabelFr = stat2LabelFr;
        this.stat2LabelEn = stat2LabelEn;
        this.stat2Value = stat2Value;
        this.stat3LabelFr = stat3LabelFr;
        this.stat3LabelEn = stat3LabelEn;
        this.stat3Value = stat3Value;
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

    public String getBadgeFr() {
        return badgeFr;
    }

    public String getBadgeEn() {
        return badgeEn;
    }

    public String getHighlight1Fr() {
        return highlight1Fr;
    }

    public String getHighlight1En() {
        return highlight1En;
    }

    public String getHighlight2Fr() {
        return highlight2Fr;
    }

    public String getHighlight2En() {
        return highlight2En;
    }

    public String getHighlight3Fr() {
        return highlight3Fr;
    }

    public String getHighlight3En() {
        return highlight3En;
    }

    public String getStat1LabelFr() {
        return stat1LabelFr;
    }

    public String getStat1LabelEn() {
        return stat1LabelEn;
    }

    public String getStat1Value() {
        return stat1Value;
    }

    public String getStat2LabelFr() {
        return stat2LabelFr;
    }

    public String getStat2LabelEn() {
        return stat2LabelEn;
    }

    public String getStat2Value() {
        return stat2Value;
    }

    public String getStat3LabelFr() {
        return stat3LabelFr;
    }

    public String getStat3LabelEn() {
        return stat3LabelEn;
    }

    public String getStat3Value() {
        return stat3Value;
    }
}