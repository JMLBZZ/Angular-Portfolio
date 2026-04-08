package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class HeroContentRequestDTO {

    @Valid
    @NotNull(message = "Le titre est obligatoire")
    private LocalizedTextDTO title;

    @Valid
    @NotNull(message = "Le sous-titre est obligatoire")
    private LocalizedTextDTO subtitle;

    private boolean available;

    @Valid
    private List<HeroTechBadgeDTO> techBadges;

    public HeroContentRequestDTO() {
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LocalizedTextDTO getSubtitle() {
        return subtitle;
    }

    public boolean isAvailable() {
        return available;
    }

    public List<HeroTechBadgeDTO> getTechBadges() {
        return techBadges;
    }
}