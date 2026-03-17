package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contact_entity")
public class ContactEntity {

    @Id
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitleEn;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String location;

    private String linkedinUrl;

    private String githubUrl;

    public ContactEntity() {
    }

    public ContactEntity(
            Long id,
            String titleFr,
            String titleEn,
            String subtitleFr,
            String subtitleEn,
            String email,
            String phone,
            String location,
            String linkedinUrl,
            String githubUrl
    ) {
        this.id = id;
        this.titleFr = titleFr;
        this.titleEn = titleEn;
        this.subtitleFr = subtitleFr;
        this.subtitleEn = subtitleEn;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.linkedinUrl = linkedinUrl;
        this.githubUrl = githubUrl;
    }

    public Long getId() {
        return id;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public String getSubtitleFr() {
        return subtitleFr;
    }

    public String getSubtitleEn() {
        return subtitleEn;
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