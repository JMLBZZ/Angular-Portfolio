package com.portfolio.portfolio_backend.domain.model;

public class HeroTechBadge {

    private Long id;
    private String label;
    private Integer displayOrder;

    public HeroTechBadge(Long id, String label, Integer displayOrder) {
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