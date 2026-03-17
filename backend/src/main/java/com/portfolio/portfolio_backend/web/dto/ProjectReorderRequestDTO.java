package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class ProjectReorderRequestDTO {

    @NotEmpty(message = "La liste des projets à réordonner est obligatoire")
    private List<@NotNull(message = "Chaque identifiant de projet est obligatoire") UUID> projectIds;

    public ProjectReorderRequestDTO() {
    }

    public List<UUID> getProjectIds() {
        return projectIds;
    }
}