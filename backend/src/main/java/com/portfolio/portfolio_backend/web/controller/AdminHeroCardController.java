package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.HeroCardContentService;
import com.portfolio.portfolio_backend.domain.model.HeroCard;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.HeroCardContentRequestDTO;
import com.portfolio.portfolio_backend.web.dto.HeroCardContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/hero-card")
@PreAuthorize("hasRole('ADMIN')")
public class AdminHeroCardController {

    private final HeroCardContentService heroCardContentService;

    public AdminHeroCardController(HeroCardContentService heroCardContentService) {
        this.heroCardContentService = heroCardContentService;
    }

    @GetMapping
    public HeroCardContentResponseDTO get() {
        return toResponse(heroCardContentService.get());
    }

    @PutMapping
    public HeroCardContentResponseDTO update(@Valid @RequestBody HeroCardContentRequestDTO dto) {
        HeroCard updatedHeroCard = heroCardContentService.update(toDomain(dto));
        return toResponse(updatedHeroCard);
    }

    private HeroCard toDomain(HeroCardContentRequestDTO dto) {
        return new HeroCard(
                toLocalizedText(dto.getTitle()),
                toLocalizedText(dto.getSubtitle()),
                toLocalizedText(dto.getBadge()),
                toLocalizedText(dto.getHighlight1()),
                toLocalizedText(dto.getHighlight2()),
                toLocalizedText(dto.getHighlight3()),
                toLocalizedText(dto.getStat1Label()),
                dto.getStat1Value(),
                toLocalizedText(dto.getStat2Label()),
                dto.getStat2Value(),
                toLocalizedText(dto.getStat3Label()),
                dto.getStat3Value()
        );
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

    private LocalizedText toLocalizedText(LocalizedTextDTO dto) {
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }
}