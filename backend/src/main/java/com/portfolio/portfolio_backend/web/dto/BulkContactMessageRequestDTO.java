package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public class BulkContactMessageRequestDTO {

    @NotEmpty(message = "La liste des messages sélectionnés est obligatoire")
    @Size(max = 100, message = "Tu peux traiter au maximum 100 messages à la fois")
    private List<@NotNull(message = "Chaque identifiant de message est obligatoire") UUID> ids;

    public BulkContactMessageRequestDTO() {
    }

    public List<UUID> getIds() {
        return ids;
    }

    public void setIds(List<UUID> ids) {
        this.ids = ids;
    }
}