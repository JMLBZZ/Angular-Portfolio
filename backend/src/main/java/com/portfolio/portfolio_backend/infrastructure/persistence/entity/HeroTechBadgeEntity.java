package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "hero_tech_badge_entity")
public class HeroTechBadgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "label", nullable = false, columnDefinition = "TEXT")
    private String label;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    public HeroTechBadgeEntity() {
    }

    public HeroTechBadgeEntity(Long id, String label, Integer displayOrder) {
        this.id = id;
        this.label = label;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }
}