package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;

public class HeroContentRequestDTO {

    @Valid
    private LocalizedTextDTO title;

    @Valid
    private LocalizedTextDTO subtitle;

    private boolean available;

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
}