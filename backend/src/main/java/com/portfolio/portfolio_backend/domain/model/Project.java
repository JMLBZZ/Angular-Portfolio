package com.portfolio.portfolio_backend.domain.model;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class Project {

    private UUID id;
    private String slug;
    private String title;
    private String category;

    private String image;
    private String cover;
    private List<String> images;

    private LocalizedText description;
    private LocalizedText longDescription;

    private List<String> stack;

    private String type;
    private boolean featured;

    private LocalizedText role;
    private LocalizedText problem;
    private LocalizedText solution;

    private String demoUrl;
    private List<String> tags;

    private String githubUrl;
    private boolean showGithub;

    private boolean published;
    private Integer displayOrder;

    private LocalDate createdAt;

    public Project(
            UUID id,
            String slug,
            String title,
            String category,
            String image,
            String cover,
            List<String> images,
            LocalizedText description,
            LocalizedText longDescription,
            List<String> stack,
            String type,
            boolean featured,
            LocalizedText role,
            LocalizedText problem,
            LocalizedText solution,
            String demoUrl,
            List<String> tags,
            String githubUrl,
            boolean showGithub,
            boolean published,
            Integer displayOrder,
            LocalDate createdAt
    ) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.category = category;
        this.image = image;
        this.cover = cover;
        this.images = images;
        this.description = description;
        this.longDescription = longDescription;
        this.stack = stack;
        this.type = type;
        this.featured = featured;
        this.role = role;
        this.problem = problem;
        this.solution = solution;
        this.demoUrl = demoUrl;
        this.tags = tags;
        this.githubUrl = githubUrl;
        this.showGithub = showGithub;
        this.published = published;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public String getImage() {
        return image;
    }

    public String getCover() {
        return cover;
    }

    public List<String> getImages() {
        return images;
    }

    public LocalizedText getDescription() {
        return description;
    }

    public LocalizedText getLongDescription() {
        return longDescription;
    }

    public List<String> getStack() {
        return stack;
    }

    public String getType() {
        return type;
    }

    public boolean isFeatured() {
        return featured;
    }

    public LocalizedText getRole() {
        return role;
    }

    public LocalizedText getProblem() {
        return problem;
    }

    public LocalizedText getSolution() {
        return solution;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public boolean isShowGithub() {
        return showGithub;
    }

    public boolean isPublished() {
        return published;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }
}