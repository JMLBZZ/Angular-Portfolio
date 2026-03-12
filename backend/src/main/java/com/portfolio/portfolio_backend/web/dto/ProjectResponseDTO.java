package com.portfolio.portfolio_backend.web.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class ProjectResponseDTO {

    private UUID id;
    private String slug;
    private String title;
    private String category;

    private String image;
    private String cover;
    private List<String> images;

    private LocalizedTextDTO description;
    private LocalizedTextDTO longDescription;

    private List<String> stack;

    private String type;
    private boolean featured;

    private LocalizedTextDTO role;
    private LocalizedTextDTO problem;
    private LocalizedTextDTO solution;

    private String demoUrl;
    private List<String> tags;

    private String githubUrl;
    private boolean showGithub;

    private boolean published;
    private Integer displayOrder;

    private LocalDate createdAt;

    public ProjectResponseDTO(
            UUID id,
            String slug,
            String title,
            String category,
            String image,
            String cover,
            List<String> images,
            LocalizedTextDTO description,
            LocalizedTextDTO longDescription,
            List<String> stack,
            String type,
            boolean featured,
            LocalizedTextDTO role,
            LocalizedTextDTO problem,
            LocalizedTextDTO solution,
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

    public LocalizedTextDTO getDescription() {
        return description;
    }

    public LocalizedTextDTO getLongDescription() {
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

    public LocalizedTextDTO getRole() {
        return role;
    }

    public LocalizedTextDTO getProblem() {
        return problem;
    }

    public LocalizedTextDTO getSolution() {
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