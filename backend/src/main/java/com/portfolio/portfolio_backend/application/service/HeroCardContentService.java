package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.HeroCard;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.port.out.HeroCardRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HeroCardContentService {

    private final HeroCardRepositoryPort heroCardRepositoryPort;

    public HeroCardContentService(HeroCardRepositoryPort heroCardRepositoryPort) {
        this.heroCardRepositoryPort = heroCardRepositoryPort;
    }

    @Transactional(readOnly = true)
    public HeroCard get() {
        return heroCardRepositoryPort.find().orElseGet(this::buildDefaultHeroCard);
    }

    @Transactional
    public HeroCard update(HeroCard heroCard) {
        HeroCard sanitizedHeroCard = new HeroCard(
                sanitizeLocalizedText(heroCard.getTitle(), 120),
                sanitizeLocalizedText(heroCard.getSubtitle(), 180),
                sanitizeLocalizedText(heroCard.getBadge(), 80),
                sanitizeLocalizedText(heroCard.getHighlight1(), 120),
                sanitizeLocalizedText(heroCard.getHighlight2(), 120),
                sanitizeLocalizedText(heroCard.getHighlight3(), 120),
                sanitizeLocalizedText(heroCard.getStat1Label(), 80),
                sanitize(heroCard.getStat1Value(), 80),
                sanitizeLocalizedText(heroCard.getStat2Label(), 80),
                sanitize(heroCard.getStat2Value(), 80),
                sanitizeLocalizedText(heroCard.getStat3Label(), 80),
                sanitize(heroCard.getStat3Value(), 80)
        );

        return heroCardRepositoryPort.save(sanitizedHeroCard);
    }

    private HeroCard buildDefaultHeroCard() {
        return new HeroCard(
                new LocalizedText("Présentation", "Overview"),
                new LocalizedText("Développement web moderne", "Modern web development"),
                new LocalizedText("Portfolio", "Portfolio"),
                new LocalizedText("Applications web modernes", "Modern web applications"),
                new LocalizedText("Architecture clean & scalable", "Clean & scalable architecture"),
                new LocalizedText("Performance & UX optimisées", "Optimized performance & UX"),
                new LocalizedText("Expérience", "Experience"),
                "3+ ans",
                new LocalizedText("Projets", "Projects"),
                "15+",
                new LocalizedText("Stack", "Stack"),
                "Angular / Spring"
        );
    }

    private LocalizedText sanitizeLocalizedText(LocalizedText text, int maxLength) {
        if (text == null) {
            return new LocalizedText("", "");
        }

        return new LocalizedText(
                sanitize(text.getFr(), maxLength),
                sanitize(text.getEn(), maxLength)
        );
    }

    private String sanitize(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        String sanitized = input
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .trim();

        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }
}