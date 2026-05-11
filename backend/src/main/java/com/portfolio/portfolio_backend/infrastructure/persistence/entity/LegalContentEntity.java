package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "legal_content_entity")
public class LegalContentEntity {

    @Id
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contentFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contentEn;

    public LegalContentEntity() {
    }

    public LegalContentEntity(
            Long id,
            String titleFr,
            String titleEn,
            String contentFr,
            String contentEn
    ) {
        this.id = id;
        this.titleFr = titleFr;
        this.titleEn = titleEn;
        this.contentFr = contentFr;
        this.contentEn = contentEn;
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

    public String getContentFr() {
        return contentFr;
    }

    public String getContentEn() {
        return contentEn;
    }
}