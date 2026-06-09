package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.portfolio_backend.domain.model.AboutContent;
import com.portfolio.portfolio_backend.domain.model.AboutSkillGroup;
import com.portfolio.portfolio_backend.domain.model.AboutTimelineItem;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.AboutContentEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class AboutContentMapper {

    private final ObjectMapper objectMapper;

    public AboutContentMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public AboutContentEntity toEntity(AboutContent aboutContent) {
        if (aboutContent == null) {
            return null;
        }

        return new AboutContentEntity(
                1L,
                getFr(aboutContent.getTitle()),
                getEn(aboutContent.getTitle()),
                getFr(aboutContent.getSubtitle()),
                getEn(aboutContent.getSubtitle()),
                aboutContent.getProfileName(),
                aboutContent.getProfileImageUrl(),
                getFr(aboutContent.getProfileRole()),
                getEn(aboutContent.getProfileRole()),
                getFr(aboutContent.getBio()),
                getEn(aboutContent.getBio()),
                getFr(aboutContent.getLocation()),
                getEn(aboutContent.getLocation()),
                getFr(aboutContent.getTimelineTitle()),
                getEn(aboutContent.getTimelineTitle()),
                getFr(aboutContent.getSkillsTitle()),
                getEn(aboutContent.getSkillsTitle()),
                getFr(aboutContent.getSoftSkillsTitle()),
                getEn(aboutContent.getSoftSkillsTitle()),
                writeJson(aboutContent.getTimelineItems()),
                writeJson(aboutContent.getSkillGroups()),
                writeJson(aboutContent.getSoftSkills())
        );
    }

    public AboutContent toDomain(AboutContentEntity entity) {
        if (entity == null) {
            return null;
        }

        return new AboutContent(
                new LocalizedText(entity.getTitleFr(), entity.getTitleEn()),
                new LocalizedText(entity.getSubtitleFr(), entity.getSubtitleEn()),
                entity.getProfileName(),
                entity.getProfileImageUrl(),
                new LocalizedText(entity.getProfileRoleFr(), entity.getProfileRoleEn()),
                new LocalizedText(entity.getBioFr(), entity.getBioEn()),
                new LocalizedText(entity.getLocationFr(), entity.getLocationEn()),
                new LocalizedText(entity.getTimelineTitleFr(), entity.getTimelineTitleEn()),
                new LocalizedText(entity.getSkillsTitleFr(), entity.getSkillsTitleEn()),
                new LocalizedText(entity.getSoftSkillsTitleFr(), entity.getSoftSkillsTitleEn()),
                readTimelineItems(entity.getTimelineItemsJson()),
                readSkillGroups(entity.getSkillGroupsJson()),
                readSoftSkills(entity.getSoftSkillsJson())
        );
    }

    private List<AboutTimelineItem> readTimelineItems(String json) {
        return readJson(json, new TypeReference<List<AboutTimelineItem>>() {});
    }

    private List<AboutSkillGroup> readSkillGroups(String json) {
        return readJson(json, new TypeReference<List<AboutSkillGroup>>() {});
    }

    private List<LocalizedText> readSoftSkills(String json) {
        return readJson(json, new TypeReference<List<LocalizedText>>() {});
    }

    private <T> List<T> readJson(String json, TypeReference<List<T>> typeReference) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(json, typeReference);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Impossible de lire le JSON AboutContent", exception);
        }
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value == null ? Collections.emptyList() : value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Impossible d'écrire le JSON AboutContent", exception);
        }
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : "";
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : "";
    }
}