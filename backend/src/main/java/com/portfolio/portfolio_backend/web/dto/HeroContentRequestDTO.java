package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;

import java.util.List;

public class HeroContentRequestDTO {

    @Valid
    private LocalizedTextDTO title;

    @Valid
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