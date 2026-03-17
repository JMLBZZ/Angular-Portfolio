package com.portfolio.portfolio_backend.web.dto;

public class ContactContentResponseDTO {

    private LocalizedTextDTO title;
    private LocalizedTextDTO subtitle;
    private String email;
    private String phone;
    private String location;
    private String linkedinUrl;
    private String githubUrl;

    public ContactContentResponseDTO(
            LocalizedTextDTO title,
            LocalizedTextDTO subtitle,
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

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LocalizedTextDTO getSubtitle() {
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