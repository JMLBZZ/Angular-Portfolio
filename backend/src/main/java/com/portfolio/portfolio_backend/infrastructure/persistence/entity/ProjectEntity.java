package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class ProjectEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    private String image;
    private String cover;

    @ElementCollection
    @CollectionTable(name = "project_images", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "image_order")
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descriptionFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String longDescriptionFr;

    @Column(columnDefinition = "TEXT")
    private String longDescriptionEn;

    @ElementCollection
    @CollectionTable(name = "project_stack", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "stack_order")
    @Column(name = "stack_value")
    private List<String> stack = new ArrayList<>();

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private boolean featured;

    @Column(columnDefinition = "TEXT")
    private String roleFr;

    @Column(columnDefinition = "TEXT")
    private String roleEn;

    @Column(columnDefinition = "TEXT")
    private String problemFr;

    @Column(columnDefinition = "TEXT")
    private String problemEn;

    @Column(columnDefinition = "TEXT")
    private String solutionFr;

    @Column(columnDefinition = "TEXT")
    private String solutionEn;

    private String demoUrl;

    @ElementCollection
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "tag_order")
    @Column(name = "tag_value")
    private List<String> tags = new ArrayList<>();

    private String githubUrl;

    @Column(nullable = false)
    private boolean showGithub;

    @Column(nullable = false)
    private boolean published;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private LocalDate createdAt;

    public ProjectEntity() {
    }

    public ProjectEntity(
            UUID id,
            String slug,
            String title,
            String category,
            String image,
            String cover,
            List<String> images,
            String descriptionFr,
            String descriptionEn,
            String longDescriptionFr,
            String longDescriptionEn,
            List<String> stack,
            String type,
            boolean featured,
            String roleFr,
            String roleEn,
            String problemFr,
            String problemEn,
            String solutionFr,
            String solutionEn,
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
        this.images = images != null ? images : new ArrayList<>();
        this.descriptionFr = descriptionFr;
        this.descriptionEn = descriptionEn;
        this.longDescriptionFr = longDescriptionFr;
        this.longDescriptionEn = longDescriptionEn;
        this.stack = stack != null ? stack : new ArrayList<>();
        this.type = type;
        this.featured = featured;
        this.roleFr = roleFr;
        this.roleEn = roleEn;
        this.problemFr = problemFr;
        this.problemEn = problemEn;
        this.solutionFr = solutionFr;
        this.solutionEn = solutionEn;
        this.demoUrl = demoUrl;
        this.tags = tags != null ? tags : new ArrayList<>();
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

    public String getDescriptionFr() {
        return descriptionFr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public String getLongDescriptionFr() {
        return longDescriptionFr;
    }

    public String getLongDescriptionEn() {
        return longDescriptionEn;
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

    public String getRoleFr() {
        return roleFr;
    }

    public String getRoleEn() {
        return roleEn;
    }

    public String getProblemFr() {
        return problemFr;
    }

    public String getProblemEn() {
        return problemEn;
    }

    public String getSolutionFr() {
        return solutionFr;
    }

    public String getSolutionEn() {
        return solutionEn;
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