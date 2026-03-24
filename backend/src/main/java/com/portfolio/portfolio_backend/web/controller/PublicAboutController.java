package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.AboutContentService;
import com.portfolio.portfolio_backend.domain.model.AboutContent;
import com.portfolio.portfolio_backend.domain.model.AboutSkillGroup;
import com.portfolio.portfolio_backend.domain.model.AboutSkillItem;
import com.portfolio.portfolio_backend.domain.model.AboutTimelineItem;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.AboutContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.AboutSkillGroupDTO;
import com.portfolio.portfolio_backend.web.dto.AboutSkillItemDTO;
import com.portfolio.portfolio_backend.web.dto.AboutTimelineItemDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/public/about")
public class PublicAboutController {

    private final AboutContentService aboutContentService;

    public PublicAboutController(AboutContentService aboutContentService) {
        this.aboutContentService = aboutContentService;
    }

    @GetMapping
    public AboutContentResponseDTO get() {
        return toResponse(aboutContentService.get());
    }

    private AboutContentResponseDTO toResponse(AboutContent aboutContent) {
        return new AboutContentResponseDTO(
                toLocalizedTextDTO(aboutContent.getTitle()),
                toLocalizedTextDTO(aboutContent.getSubtitle()),
                aboutContent.getProfileName(),
                toLocalizedTextDTO(aboutContent.getProfileRole()),
                toLocalizedTextDTO(aboutContent.getBio()),
                toLocalizedTextDTO(aboutContent.getLocation()),
                toLocalizedTextDTO(aboutContent.getTimelineTitle()),
                toLocalizedTextDTO(aboutContent.getSkillsTitle()),
                toLocalizedTextDTO(aboutContent.getSoftSkillsTitle()),
                toTimelineDtoList(aboutContent.getTimelineItems()),
                toSkillGroupDtoList(aboutContent.getSkillGroups()),
                toLocalizedTextDtoList(aboutContent.getSoftSkills())
        );
    }

    private List<AboutTimelineItemDTO> toTimelineDtoList(List<AboutTimelineItem> items) {
        if (items == null) {
            return Collections.emptyList();
        }

        return items.stream()
                .map(item -> new AboutTimelineItemDTO(
                        toLocalizedTextDTO(item.getDate()),
                        toLocalizedTextDTO(item.getCompany()),
                        toLocalizedTextDTO(item.getTitle()),
                        toLocalizedTextDTO(item.getDescription()),
                        item.getIcon()
                ))
                .toList();
    }

    private List<AboutSkillGroupDTO> toSkillGroupDtoList(List<AboutSkillGroup> groups) {
        if (groups == null) {
            return Collections.emptyList();
        }

        return groups.stream()
                .map(group -> new AboutSkillGroupDTO(
                        toLocalizedTextDTO(group.getTitle()),
                        toSkillItemDtoList(group.getItems())
                ))
                .toList();
    }

    private List<AboutSkillItemDTO> toSkillItemDtoList(List<AboutSkillItem> items) {
        if (items == null) {
            return Collections.emptyList();
        }

        return items.stream()
                .map(item -> new AboutSkillItemDTO(item.getName(), item.getValue()))
                .toList();
    }

    private List<LocalizedTextDTO> toLocalizedTextDtoList(List<LocalizedText> items) {
        if (items == null) {
            return Collections.emptyList();
        }

        return items.stream()
                .map(this::toLocalizedTextDTO)
                .toList();
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText text) {
        return new LocalizedTextDTO(text.getFr(), text.getEn());
    }
}