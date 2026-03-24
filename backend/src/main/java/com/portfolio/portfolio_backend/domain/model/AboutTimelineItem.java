package com.portfolio.portfolio_backend.domain.model;

public class AboutTimelineItem {

    private LocalizedText date;
    private LocalizedText company;
    private LocalizedText title;
    private LocalizedText description;
    private String icon;

    public AboutTimelineItem(
            LocalizedText date,
            LocalizedText company,
            LocalizedText title,
            LocalizedText description,
            String icon
    ) {
        this.date = date;
        this.company = company;
        this.title = title;
        this.description = description;
        this.icon = icon;
    }

    public LocalizedText getDate() {
        return date;
    }

    public LocalizedText getCompany() {
        return company;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }
}