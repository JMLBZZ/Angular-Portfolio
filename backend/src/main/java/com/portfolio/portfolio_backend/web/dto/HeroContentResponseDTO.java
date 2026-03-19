package com.portfolio.portfolio_backend.web.dto;

import java.util.List;

public class HeroContentResponseDTO {

    private LocalizedTextDTO title;
    private LocalizedTextDTO subtitle;
    private boolean available;
    private List<HeroTechBadgeDTO> techBadges;

    public HeroContentResponseDTO(
            LocalizedTextDTO title,
            LocalizedTextDTO subtitle,
            boolean available,
            List<HeroTechBadgeDTO> techBadges
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.available = available;
        this.techBadges = techBadges;
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