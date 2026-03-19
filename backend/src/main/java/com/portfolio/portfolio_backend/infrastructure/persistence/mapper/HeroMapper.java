package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroEntity;
import org.springframework.stereotype.Component;

@Component
public class HeroMapper {

    public HeroEntity toEntity(Hero hero) {
        if (hero == null) {
            return null;
        }

        return new HeroEntity(
                1L,
                getFr(hero.getTitle()),
                getEn(hero.getTitle()),
                getFr(hero.getSubtitle()),
                getEn(hero.getSubtitle()),
                hero.isAvailable()
        );
    }

    public Hero toDomain(HeroEntity entity) {
        if (entity == null) {
            return null;
        }

        return new Hero(
                new LocalizedText(entity.getTitleFr(), entity.getTitleEn()),
                new LocalizedText(entity.getSubtitleFr(), entity.getSubtitleEn()),
                entity.isAvailable()
        );
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : null;
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : null;
    }
}