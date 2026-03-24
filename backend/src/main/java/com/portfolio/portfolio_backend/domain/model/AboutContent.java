package com.portfolio.portfolio_backend.domain.model;

import java.util.List;

public class AboutContent {

    private LocalizedText title;
    private LocalizedText subtitle;
    private String profileName;
    private LocalizedText profileRole;
    private LocalizedText bio;
    private LocalizedText location;
    private LocalizedText timelineTitle;
    private LocalizedText skillsTitle;
    private LocalizedText softSkillsTitle;
    private List<AboutTimelineItem> timelineItems;
    private List<AboutSkillGroup> skillGroups;
    private List<LocalizedText> softSkills;

    public AboutContent(
            LocalizedText title,
            LocalizedText subtitle,
            String profileName,
            LocalizedText profileRole,
            LocalizedText bio,
            LocalizedText location,
            LocalizedText timelineTitle,
            LocalizedText skillsTitle,
            LocalizedText softSkillsTitle,
            List<AboutTimelineItem> timelineItems,
            List<AboutSkillGroup> skillGroups,
            List<LocalizedText> softSkills
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.profileName = profileName;
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

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getSubtitle() {
        return subtitle;
    }

    public String getProfileName() {
        return profileName;
    }

    public LocalizedText getProfileRole() {
        return profileRole;
    }

    public LocalizedText getBio() {
        return bio;
    }

    public LocalizedText getLocation() {
        return location;
    }

    public LocalizedText getTimelineTitle() {
        return timelineTitle;
    }

    public LocalizedText getSkillsTitle() {
        return skillsTitle;
    }

    public LocalizedText getSoftSkillsTitle() {
        return softSkillsTitle;
    }

    public List<AboutTimelineItem> getTimelineItems() {
        return timelineItems;
    }

    public List<AboutSkillGroup> getSkillGroups() {
        return skillGroups;
    }

    public List<LocalizedText> getSoftSkills() {
        return softSkills;
    }
}