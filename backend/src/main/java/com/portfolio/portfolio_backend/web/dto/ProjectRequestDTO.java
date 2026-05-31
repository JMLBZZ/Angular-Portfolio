package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ProjectRequestDTO {

    @NotBlank(message = "Le slug est obligatoire")
    private String slug;

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "La catégorie est obligatoire")
    private String category;

    private String image;
    private String cover;
    private List<String> images;

    @Valid
    @NotNull(message = "La description est obligatoire")
    private ProjectShortLocalizedTextDTO description;

    @Valid
    private ProjectLongLocalizedTextDTO longDescription;

    @NotEmpty(message = "La stack est obligatoire")
    private List<String> stack;

    @NotBlank(message = "Le type est obligatoire")
    private String type;

    private Boolean featured;

    @Valid
    private ProjectDetailLocalizedTextDTO role;

    @Valid
    private ProjectDetailLocalizedTextDTO problem;

    @Valid
    private ProjectDetailLocalizedTextDTO solution;

    private String demoUrl;

    @NotEmpty(message = "Les tags sont obligatoires")
    private List<String> tags;

    private String githubUrl;
    private Boolean showGithub;
    private Boolean published;

    public ProjectRequestDTO() {
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

    public ProjectShortLocalizedTextDTO getDescription() {
        return description;
    }

    public ProjectLongLocalizedTextDTO getLongDescription() {
        return longDescription;
    }

    public List<String> getStack() {
        return stack;
    }

    public String getType() {
        return type;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public ProjectDetailLocalizedTextDTO getRole() {
        return role;
    }

    public ProjectDetailLocalizedTextDTO getProblem() {
        return problem;
    }

    public ProjectDetailLocalizedTextDTO getSolution() {
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

    public Boolean getShowGithub() {
        return showGithub;
    }

    public Boolean getPublished() {
        return published;
    }
}