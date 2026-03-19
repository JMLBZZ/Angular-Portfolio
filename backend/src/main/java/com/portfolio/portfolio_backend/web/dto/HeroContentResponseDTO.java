package com.portfolio.portfolio_backend.web.dto;

public class HeroContentResponseDTO {

    private LocalizedTextDTO title;
    private LocalizedTextDTO subtitle;
    private boolean available;

    public HeroContentResponseDTO(
            LocalizedTextDTO title,
            LocalizedTextDTO subtitle,
            boolean available
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.available = available;
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
}