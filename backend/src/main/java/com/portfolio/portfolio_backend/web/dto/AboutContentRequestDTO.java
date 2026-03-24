package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class AboutContentRequestDTO {

    @Valid
    private LocalizedTextDTO title;

    @Valid
    private LocalizedTextDTO subtitle;

    @NotBlank(message = "Le nom du profil est obligatoire")
    @Size(max = 120, message = "Le nom du profil est trop long")
    private String profileName;

    @Valid
    private LocalizedTextDTO profileRole;

    @Valid
    private LocalizedTextDTO bio;

    @Valid
    private LocalizedTextDTO location;

    @Valid
    private LocalizedTextDTO timelineTitle;

    @Valid
    private LocalizedTextDTO skillsTitle;

    @Valid
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