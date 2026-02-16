package com.portfolio.portfolio_backend.web.dto;
//RequestDTO = Entrée API
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectRequestDTO {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, message = "Title must be at least 3 characters")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    private String description;
    
    private String githubUrl;
    private String liveUrl;

    //Getters
    public ProjectRequestDTO() {}

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getGithubUrl() { return githubUrl; }
    public String getLiveUrl() { return liveUrl; }
}
