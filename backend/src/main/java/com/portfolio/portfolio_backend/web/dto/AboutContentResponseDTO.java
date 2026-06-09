package com.portfolio.portfolio_backend.web.dto;

import java.util.List;

public class AboutContentResponseDTO {

    private LocalizedTextDTO title;
    private LocalizedTextDTO subtitle;
    private String profileName;
    private String profileImageUrl;
    private LocalizedTextDTO profileRole;
    private LocalizedTextDTO bio;
    private LocalizedTextDTO location;
    private LocalizedTextDTO timelineTitle;
    private LocalizedTextDTO skillsTitle;
    private LocalizedTextDTO softSkillsTitle;
    private List<AboutTimelineItemDTO> timelineItems;
    private List<AboutSkillGroupDTO> skillGroups;
    private List<LocalizedTextDTO> softSkills;

    public AboutContentResponseDTO(
            LocalizedTextDTO title,
            LocalizedTextDTO subtitle,
            String profileName,
            String profileImageUrl,
            LocalizedTextDTO profileRole,
            LocalizedTextDTO bio,
            LocalizedTextDTO location,
            LocalizedTextDTO timelineTitle,
            LocalizedTextDTO skillsTitle,
            LocalizedTextDTO softSkillsTitle,
            List<AboutTimelineItemDTO> timelineItems,
            List<AboutSkillGroupDTO> skillGroups,
            List<LocalizedTextDTO> softSkills
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.profileName = profileName;
        this.profileImageUrl = profileImageUrl;
        this.profileRole = profileRole;
        this.bio = bio;
        this.location = location;
        this.timelineTitle = timelineTitle;
        this.skillsTitle = skillsTitle;
        this.softSkillsTitle = softSkillsTitle;
        this.timelineItems = timelineItems;
        this.skillGroups = skillGroups;
        this.softSkills = softSkills;
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