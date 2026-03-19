package com.portfolio.portfolio_backend.domain.model;

import java.util.List;

public class Hero {

    private LocalizedText title;
    private LocalizedText subtitle;
    private boolean available;
    private List<HeroTechBadge> techBadges;

    public Hero(
            LocalizedText title,
            LocalizedText subtitle,
            boolean available,
            List<HeroTechBadge> techBadges
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.available = available;
        this.techBadges = techBadges;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getSubtitle() {
        return subtitle;
    }

    public boolean isAvailable() {
        return available;
    }

    public List<HeroTechBadge> getTechBadges() {
        return techBadges;
    }
}