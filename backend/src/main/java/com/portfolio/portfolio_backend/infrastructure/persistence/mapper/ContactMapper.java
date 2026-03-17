package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.Contact;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ContactEntity;
import org.springframework.stereotype.Component;

@Component
public class ContactMapper {

    public ContactEntity toEntity(Contact contact) {
        if (contact == null) {
            return null;
        }

        return new ContactEntity(
                1L,
                getFr(contact.getTitle()),
                getEn(contact.getTitle()),
                getFr(contact.getSubtitle()),
                getEn(contact.getSubtitle()),
                contact.getEmail(),
                contact.getPhone(),
                contact.getLocation(),
                contact.getLinkedinUrl(),
                contact.getGithubUrl()
        );
    }

    public Contact toDomain(ContactEntity entity) {
        if (entity == null) {
            return null;
        }

        return new Contact(
                new LocalizedText(entity.getTitleFr(), entity.getTitleEn()),
                new LocalizedText(entity.getSubtitleFr(), entity.getSubtitleEn()),
                entity.getEmail(),
                entity.getPhone(),
                entity.getLocation(),
                entity.getLinkedinUrl(),
                entity.getGithubUrl()
        );
    }

    private String getFr(LocalizedText text) {
        return text != null ? text.getFr() : null;
    }

    private String getEn(LocalizedText text) {
        return text != null ? text.getEn() : null;
    }
}