package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.AboutContentService;
import com.portfolio.portfolio_backend.domain.model.AboutContent;
import com.portfolio.portfolio_backend.domain.model.AboutSkillGroup;
import com.portfolio.portfolio_backend.domain.model.AboutSkillItem;
import com.portfolio.portfolio_backend.domain.model.AboutTimelineItem;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.AboutContentRequestDTO;
import com.portfolio.portfolio_backend.web.dto.AboutContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.AboutSkillGroupDTO;
import com.portfolio.portfolio_backend.web.dto.AboutSkillItemDTO;
import com.portfolio.portfolio_backend.web.dto.AboutTimelineItemDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin/about")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAboutController {

    private final AboutContentService aboutContentService;

    public AdminAboutController(AboutContentService aboutContentService) {
        this.aboutContentService = aboutContentService;
    }

    @GetMapping
    public AboutContentResponseDTO get() {
        return toResponse(aboutContentService.get());
    }

    @PutMapping
    public AboutContentResponseDTO update(@Valid @RequestBody AboutContentRequestDTO dto) {
        AboutContent updated = aboutContentService.update(toDomain(dto));
        return toResponse(updated);
    }

    private AboutContent toDomain(AboutContentRequestDTO dto) {
        return new AboutContent(
                toLocalizedText(dto.getTitle()),
                toLocalizedText(dto.getSubtitle()),
                dto.getProfileName(),
                toLocalizedText(dto.getProfileRole()),
                toLocalizedText(dto.getBio()),
                toLocalizedText(dto.getLocation()),
                toLocalizedText(dto.getTimelineTitle()),
                toLocalizedText(dto.getSkillsTitle()),
                toLocalizedText(dto.getSoftSkillsTitle()),
                toTimelineDomainList(dto.getTimelineItems()),
                toSkillGroupDomainList(dto.getSkillGroups()),
                toLocalizedTextDomainList(dto.getSoftSkills())
        );
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

    private List<AboutTimelineItem> toTimelineDomainList(List<AboutTimelineItemDTO> items) {
        if (items == null) {
            return Collections.emptyList();
        }

        return items.stream()
                .map(item -> new AboutTimelineItem(
                        toLocalizedText(item.getDate()),
                        toLocalizedText(item.getCompany()),
                        toLocalizedText(item.getTitle()),
                        toLocalizedText(item.getDescription()),
                        item.getIcon()
                ))
                .toList();
    }

    private List<AboutSkillGroup> toSkillGroupDomainList(List<AboutSkillGroupDTO> groups) {
        if (groups == null) {
            return Collections.emptyList();
        }

        return groups.stream()
                .map(group -> new AboutSkillGroup(
                        toLocalizedText(group.getTitle()),
                        toSkillItemDomainList(group.getItems())
                ))
                .toList();
    }

    private List<AboutSkillItem> toSkillItemDomainList(List<AboutSkillItemDTO> items) {
        if (items == null) {
            return Collections.emptyList();
        }

        return items.stream()
                .map(item -> new AboutSkillItem(item.getName(), item.getValue()))
                .toList();
    }

    private List<LocalizedText> toLocalizedTextDomainList(List<LocalizedTextDTO> items) {
        if (items == null) {
            return Collections.emptyList();
        }

        return items.stream()
                .map(this::toLocalizedText)
                .toList();
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

    private LocalizedText toLocalizedText(LocalizedTextDTO dto) {
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText text) {
        return new LocalizedTextDTO(text.getFr(), text.getEn());
    }
}