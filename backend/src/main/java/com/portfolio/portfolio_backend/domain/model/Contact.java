package com.portfolio.portfolio_backend.domain.model;

public class Contact {

    private LocalizedText title;
    private LocalizedText subtitle;
    private String email;
    private String phone;
    private String location;
    private String linkedinUrl;
    private String githubUrl;

    public Contact(
            LocalizedText title,
            LocalizedText subtitle,
            String email,
            String phone,
            String location,
            String linkedinUrl,
            String githubUrl
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.linkedinUrl = linkedinUrl;
        this.githubUrl = githubUrl;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getSubtitle() {
        return subtitle;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }
}