package com.portfolio.portfolio_backend.infrastructure.web.dto;
//RequestDTO = Entrée API
import jakarta.validation.constraints.NotBlank;

public class ProjectRequestDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;
    @NotBlank(message = "La description est obligatoire")
    private String description;
    private String githubUrl;
    private String liveUrl;

    public ProjectRequestDTO() {}

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getGithubUrl() { return githubUrl; }
    public String getLiveUrl() { return liveUrl; }
}
