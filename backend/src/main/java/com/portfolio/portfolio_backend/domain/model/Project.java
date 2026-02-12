package com.portfolio.portfolio_backend.domain.model;

import java.time.LocalDate;
import java.util.UUID;

public class Project {

    private UUID id;
    private String title;
    private String description;
    private String githubUrl;
    private String liveUrl;
    private LocalDate createdAt;

    public Project(UUID id, String title, String description, String githubUrl, String liveUrl, LocalDate createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.githubUrl = githubUrl;
        this.liveUrl = liveUrl;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getGithubUrl() { return githubUrl; }
    public String getLiveUrl() { return liveUrl; }
    public LocalDate getCreatedAt() { return createdAt; }
}

/* 
package com.portfolio.portfolio_backend.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String description;
    private String githubUrl;
    private String liveUrl;
    private LocalDate createdAt;

    public Project() {}

    public Project(UUID id, String title, String description, String githubUrl, String liveUrl, LocalDate createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.githubUrl = githubUrl;
        this.liveUrl = liveUrl;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getGithubUrl() { return githubUrl; }
    public String getLiveUrl() { return liveUrl; }
    public LocalDate getCreatedAt() { return createdAt; }
}
*/