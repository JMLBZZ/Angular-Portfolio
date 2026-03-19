package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.port.out.HeroRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HeroContentService {

    private final HeroRepositoryPort heroRepositoryPort;

    public HeroContentService(HeroRepositoryPort heroRepositoryPort) {
        this.heroRepositoryPort = heroRepositoryPort;
    }

    @Transactional(readOnly = true)
    public Hero get() {
        return heroRepositoryPort.find().orElseGet(this::buildDefaultHero);
    }

    @Transactional
    public Hero update(Hero hero) {
        Hero sanitizedHero = new Hero(
                sanitizeLocalizedText(hero.getTitle()),
                sanitizeLocalizedText(hero.getSubtitle()),
                hero.isAvailable()
        );

        return heroRepositoryPort.save(sanitizedHero);
    }

    private Hero buildDefaultHero() {
        return new Hero(
                new LocalizedText("Développeur", "Full-Stack"),
                new LocalizedText(
                        "Je conçois des interfaces modernes et des APIs sécurisées. J’aime les projets propres, performants et maintenables.",
                        "I design modern interfaces and secure APIs. I enjoy clean, performant and maintainable projects."
                ),
                true
        );
    }

    private LocalizedText sanitizeLocalizedText(LocalizedText text) {
        if (text == null) {
            return new LocalizedText("", "");
        }

        return new LocalizedText(
                sanitize(text.getFr(), 255),
                sanitize(text.getEn(), 255)
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