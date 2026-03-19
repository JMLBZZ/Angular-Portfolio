package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.HeroContentService;
import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.HeroContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/hero")
public class PublicHeroController {

    private final HeroContentService heroContentService;

    public PublicHeroController(HeroContentService heroContentService) {
        this.heroContentService = heroContentService;
    }

    @GetMapping
    public HeroContentResponseDTO get() {
        return toResponse(heroContentService.get());
    }

    private HeroContentResponseDTO toResponse(Hero hero) {
        return new HeroContentResponseDTO(
                toLocalizedTextDTO(hero.getTitle()),
                toLocalizedTextDTO(hero.getSubtitle()),
                hero.isAvailable()
        );
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }
}