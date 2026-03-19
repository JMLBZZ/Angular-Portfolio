package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.Hero;
import com.portfolio.portfolio_backend.domain.model.HeroTechBadge;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroTechBadgeEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

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

    public Hero toDomain(HeroEntity entity, List<HeroTechBadgeEntity> badgeEntities) {
        if (entity == null) {
            return null;
        }

        List<HeroTechBadge> badges = badgeEntities == null
                ? Collections.emptyList()
                : badgeEntities.stream()
                    .map(this::toBadgeDomain)
                    .toList();

        return new Hero(
                new LocalizedText(entity.getTitleFr(), entity.getTitleEn()),
                new LocalizedText(entity.getSubtitleFr(), entity.getSubtitleEn()),
                entity.isAvailable(),
                badges
        );
    }

    public HeroTechBadgeEntity toBadgeEntity(HeroTechBadge badge) {
        if (badge == null) {
            return null;
        }

        return new HeroTechBadgeEntity(
                badge.getId(),
                badge.getLabel(),
                badge.getDisplayOrder()
        );
    }

    public HeroTechBadge toBadgeDomain(HeroTechBadgeEntity entity) {
        if (entity == null) {
            return null;
        }

        return new HeroTechBadge(
                entity.getId(),
                entity.getLabel(),
                entity.getDisplayOrder()
        );
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : null;
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : null;
    }
}