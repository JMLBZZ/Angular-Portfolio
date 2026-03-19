package com.portfolio.portfolio_backend.domain.model;

public class Hero {

    private LocalizedText title;
    private LocalizedText subtitle;
    private boolean available;

    public Hero(LocalizedText title, LocalizedText subtitle, boolean available) {
        this.title = title;
        this.subtitle = subtitle;
        this.available = available;
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
}