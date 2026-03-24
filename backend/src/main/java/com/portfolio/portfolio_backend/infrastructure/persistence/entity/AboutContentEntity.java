package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "about_content")
public class AboutContentEntity {

    @Id
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitleEn;

    @Column(nullable = false)
    private String profileName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String profileRoleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String profileRoleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String bioFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String bioEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String locationFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String locationEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String timelineTitleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String timelineTitleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String skillsTitleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String skillsTitleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String softSkillsTitleFr;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String softSkillsTitleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String timelineItemsJson;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String skillGroupsJson;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String softSkillsJson;

    public AboutContentEntity() {
    }

    public AboutContentEntity(
            Long id,
            String titleFr,
            String titleEn,
            String subtitleFr,
            String subtitleEn,
            String profileName,
            String profileRoleFr,
            String profileRoleEn,
            String bioFr,
            String bioEn,
            String locationFr,
            String locationEn,
            String timelineTitleFr,
            String timelineTitleEn,
            String skillsTitleFr,
            String skillsTitleEn,
            String softSkillsTitleFr,
            String softSkillsTitleEn,
            String timelineItemsJson,
            String skillGroupsJson,
            String softSkillsJson
    ) {
        this.id = id;
        this.titleFr = titleFr;
        this.titleEn = titleEn;
        this.subtitleFr = subtitleFr;
        this.subtitleEn = subtitleEn;
        this.profileName = profileName;
        this.profileRoleFr = profileRoleFr;
        this.profileRoleEn = profileRoleEn;
        this.bioFr = bioFr;
        this.bioEn = bioEn;
        this.locationFr = locationFr;
        this.locationEn = locationEn;
        this.timelineTitleFr = timelineTitleFr;
        this.timelineTitleEn = timelineTitleEn;
        this.skillsTitleFr = skillsTitleFr;
        this.skillsTitleEn = skillsTitleEn;
        this.softSkillsTitleFr = softSkillsTitleFr;
        this.softSkillsTitleEn = softSkillsTitleEn;
        this.timelineItemsJson = timelineItemsJson;
        this.skillGroupsJson = skillGroupsJson;
        this.softSkillsJson = softSkillsJson;
    }

    public Long getId() {
        return id;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public String getSubtitleFr() {
        return subtitleFr;
    }

    public String getSubtitleEn() {
        return subtitleEn;
    }

    public String getProfileName() {
        return profileName;
    }

    public String getProfileRoleFr() {
        return profileRoleFr;
    }

    public String getProfileRoleEn() {
        return profileRoleEn;
    }

    public String getBioFr() {
        return bioFr;
    }

    public String getBioEn() {
        return bioEn;
    }

    public String getLocationFr() {
        return locationFr;
    }

    public String getLocationEn() {
        return locationEn;
    }

    public String getTimelineTitleFr() {
        return timelineTitleFr;
    }

    public String getTimelineTitleEn() {
        return timelineTitleEn;
    }

    public String getSkillsTitleFr() {
        return skillsTitleFr;
    }

    public String getSkillsTitleEn() {
        return skillsTitleEn;
    }

    public String getSoftSkillsTitleFr() {
        return softSkillsTitleFr;
    }

    public String getSoftSkillsTitleEn() {
        return softSkillsTitleEn;
    }

    public String getTimelineItemsJson() {
        return timelineItemsJson;
    }

    public String getSkillGroupsJson() {
        return skillGroupsJson;
    }

    public String getSoftSkillsJson() {
        return softSkillsJson;
    }
}