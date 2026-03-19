package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.HeroCardContentService;
import com.portfolio.portfolio_backend.domain.model.HeroCard;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.HeroCardContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/hero-card")
public class PublicHeroCardController {

    private final HeroCardContentService heroCardContentService;

    public PublicHeroCardController(HeroCardContentService heroCardContentService) {
        this.heroCardContentService = heroCardContentService;
    }

    @GetMapping
    public HeroCardContentResponseDTO get() {
        return toResponse(heroCardContentService.get());
    }

    private HeroCardContentResponseDTO toResponse(HeroCard heroCard) {
        return new HeroCardContentResponseDTO(
                toLocalizedTextDTO(heroCard.getTitle()),
                toLocalizedTextDTO(heroCard.getSubtitle()),
                toLocalizedTextDTO(heroCard.getBadge()),
                toLocalizedTextDTO(heroCard.getHighlight1()),
                toLocalizedTextDTO(heroCard.getHighlight2()),
                toLocalizedTextDTO(heroCard.getHighlight3()),
                toLocalizedTextDTO(heroCard.getStat1Label()),
                heroCard.getStat1Value(),
                toLocalizedTextDTO(heroCard.getStat2Label()),
                heroCard.getStat2Value(),
                toLocalizedTextDTO(heroCard.getStat3Label()),
                heroCard.getStat3Value()
        );
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }
}