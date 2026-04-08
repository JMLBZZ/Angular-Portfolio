package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class HeroTechBadgeDTO {

    private Long id;

    @NotBlank(message = "Le libellé du badge est obligatoire")
    @Size(max = 40, message = "Le libellé du badge est trop long")
    private String label;

    @NotNull(message = "L'ordre d'affichage du badge est obligatoire")
    @Min(value = 0, message = "L'ordre d'affichage du badge doit être supérieur ou égal à 0")
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