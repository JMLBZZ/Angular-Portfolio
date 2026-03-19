package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.HeroCard;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.HeroCardEntity;
import org.springframework.stereotype.Component;

@Component
public class HeroCardMapper {

    public HeroCardEntity toEntity(HeroCard heroCard) {
        if (heroCard == null) {
            return null;
        }

        return new HeroCardEntity(
                1L,
                getFr(heroCard.getTitle()),
                getEn(heroCard.getTitle()),
                getFr(heroCard.getSubtitle()),
                getEn(heroCard.getSubtitle()),
                getFr(heroCard.getBadge()),
                getEn(heroCard.getBadge()),
                getFr(heroCard.getHighlight1()),
                getEn(heroCard.getHighlight1()),
                getFr(heroCard.getHighlight2()),
                getEn(heroCard.getHighlight2()),
                getFr(heroCard.getHighlight3()),
                getEn(heroCard.getHighlight3()),
                getFr(heroCard.getStat1Label()),
                getEn(heroCard.getStat1Label()),
                heroCard.getStat1Value(),
                getFr(heroCard.getStat2Label()),
                getEn(heroCard.getStat2Label()),
                heroCard.getStat2Value(),
                getFr(heroCard.getStat3Label()),
                getEn(heroCard.getStat3Label()),
                heroCard.getStat3Value()
        );
    }

    public HeroCard toDomain(HeroCardEntity entity) {
        if (entity == null) {
            return null;
        }

        return new HeroCard(
                new LocalizedText(entity.getTitleFr(), entity.getTitleEn()),
                new LocalizedText(entity.getSubtitleFr(), entity.getSubtitleEn()),
                new LocalizedText(entity.getBadgeFr(), entity.getBadgeEn()),
                new LocalizedText(entity.getHighlight1Fr(), entity.getHighlight1En()),
                new LocalizedText(entity.getHighlight2Fr(), entity.getHighlight2En()),
                new LocalizedText(entity.getHighlight3Fr(), entity.getHighlight3En()),
                new LocalizedText(entity.getStat1LabelFr(), entity.getStat1LabelEn()),
                entity.getStat1Value(),
                new LocalizedText(entity.getStat2LabelFr(), entity.getStat2LabelEn()),
                entity.getStat2Value(),
                new LocalizedText(entity.getStat3LabelFr(), entity.getStat3LabelEn()),
                entity.getStat3Value()
        );
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : null;
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : null;
    }
}