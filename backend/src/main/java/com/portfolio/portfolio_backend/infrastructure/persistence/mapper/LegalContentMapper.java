package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.LegalContent;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.LegalContentEntity;
import org.springframework.stereotype.Component;

@Component
public class LegalContentMapper {

    public LegalContentEntity toEntity(LegalContent legalContent) {
        if (legalContent == null) {
            return null;
        }

        return new LegalContentEntity(
                1L,
                getFr(legalContent.getTitle()),
                getEn(legalContent.getTitle()),
                getFr(legalContent.getContent()),
                getEn(legalContent.getContent())
        );
    }

    public LegalContent toDomain(LegalContentEntity entity) {
        if (entity == null) {
            return null;
        }

        return new LegalContent(
                new LocalizedText(entity.getTitleFr(), entity.getTitleEn()),
                new LocalizedText(entity.getContentFr(), entity.getContentEn())
        );
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : null;
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : null;
    }
}