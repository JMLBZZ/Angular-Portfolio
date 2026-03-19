package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.HeroContentService;
import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.model.HeroTechBadge;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.HeroContentRequestDTO;
import com.portfolio.portfolio_backend.web.dto.HeroContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.HeroTechBadgeDTO;
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
@RequestMapping("/api/admin/hero")
@PreAuthorize("hasRole('ADMIN')")
public class AdminHeroController {

    private final HeroContentService heroContentService;

    public AdminHeroController(HeroContentService heroContentService) {
        this.heroContentService = heroContentService;
    }

    @GetMapping
    public HeroContentResponseDTO get() {
        return toResponse(heroContentService.get());
    }

    @PutMapping
    public HeroContentResponseDTO update(@Valid @RequestBody HeroContentRequestDTO dto) {
        Hero updatedHero = heroContentService.update(toDomain(dto));
        return toResponse(updatedHero);
    }

    private Hero toDomain(HeroContentRequestDTO dto) {
        return new Hero(
                toLocalizedText(dto.getTitle()),
                toLocalizedText(dto.getSubtitle()),
                dto.isAvailable(),
                toBadgeDomainList(dto.getTechBadges())
        );
    }

    private HeroContentResponseDTO toResponse(Hero hero) {
        return new HeroContentResponseDTO(
                toLocalizedTextDTO(hero.getTitle()),
                toLocalizedTextDTO(hero.getSubtitle()),
                hero.isAvailable(),
                toBadgeDtoList(hero.getTechBadges())
        );
    }

    private List<HeroTechBadge> toBadgeDomainList(List<HeroTechBadgeDTO> badges) {
        if (badges == null) {
            return Collections.emptyList();
        }

        return badges.stream()
                .map(badge -> new HeroTechBadge(
                        badge.getId(),
                        badge.getLabel(),
                        badge.getDisplayOrder()
                ))
                .toList();
    }

    private List<HeroTechBadgeDTO> toBadgeDtoList(List<HeroTechBadge> badges) {
        if (badges == null) {
            return Collections.emptyList();
        }

        return badges.stream()
                .map(badge -> new HeroTechBadgeDTO(
                        badge.getId(),
                        badge.getLabel(),
                        badge.getDisplayOrder()
                ))
                .toList();
    }

    private LocalizedText toLocalizedText(LocalizedTextDTO dto) {
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }
}