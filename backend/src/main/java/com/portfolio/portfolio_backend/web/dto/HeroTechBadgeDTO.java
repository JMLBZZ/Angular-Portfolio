package com.portfolio.portfolio_backend.web.dto;

public class HeroTechBadgeDTO {

    private Long id;
    private String label;
    private Integer displayOrder;

    public HeroTechBadgeDTO() {
    }

    public HeroTechBadgeDTO(Long id, String label, Integer displayOrder) {
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