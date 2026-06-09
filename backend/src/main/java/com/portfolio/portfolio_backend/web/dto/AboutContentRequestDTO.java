package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class AboutContentRequestDTO {

    @Valid
    @NotNull(message = "Le titre est obligatoire")
    private LocalizedTextDTO title;

    @Valid
    @NotNull(message = "Le sous-titre est obligatoire")
    private LocalizedTextDTO subtitle;

    @NotBlank(message = "Le nom du profil est obligatoire")
    @Size(max = 120, message = "Le nom du profil est trop long")
    private String profileName;

    @Size(max = 1000, message = "L'URL de la photo de profil est trop longue")
    private String profileImageUrl;

    @Valid
    @NotNull(message = "Le rôle du profil est obligatoire")
    private LocalizedTextDTO profileRole;

    @Valid
    @NotNull(message = "La biographie est obligatoire")
    private LocalizedTextDTO bio;

    @Valid
    @NotNull(message = "La localisation est obligatoire")
    private LocalizedTextDTO location;

    @Valid
    @NotNull(message = "Le titre de la timeline est obligatoire")
    private LocalizedTextDTO timelineTitle;

    @Valid
    @NotNull(message = "Le titre des compétences est obligatoire")
    private LocalizedTextDTO skillsTitle;

    @Valid
    @NotNull(message = "Le titre des soft skills est obligatoire")
    private LocalizedTextDTO softSkillsTitle;

    @Valid
    private List<AboutTimelineItemDTO> timelineItems;

    @Valid
    private List<AboutSkillGroupDTO> skillGroups;

    @Valid
    private List<LocalizedTextDTO> softSkills;

    public AboutContentRequestDTO() {
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LocalizedTextDTO getSubtitle() {
        return subtitle;
    }

    public String getProfileName() {
        return profileName;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public LocalizedTextDTO getProfileRole() {
        return profileRole;
    }

    public LocalizedTextDTO getBio() {
        return bio;
    }

    public LocalizedTextDTO getLocation() {
        return location;
    }

    public LocalizedTextDTO getTimelineTitle() {
        return timelineTitle;
    }

    public LocalizedTextDTO getSkillsTitle() {
        return skillsTitle;
    }

    public LocalizedTextDTO getSoftSkillsTitle() {
        return softSkillsTitle;
    }

    public List<AboutTimelineItemDTO> getTimelineItems() {
        return timelineItems;
    }

    public List<AboutSkillGroupDTO> getSkillGroups() {
        return skillGroups;
    }

    public List<LocalizedTextDTO> getSoftSkills() {
        return softSkills;
    }
}