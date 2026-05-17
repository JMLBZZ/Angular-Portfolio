package com.portfolio.portfolio_backend.infrastructure.persistence.mapper;

import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ContactMessageEntity;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    public ContactMessageEntity toEntity(ContactMessage message) {
        if (message == null) {
            return null;
        }

        return new ContactMessageEntity(
                message.getId(),
                message.getSenderName(),
                message.getSenderEmail(),
                message.getSubject(),
                message.getMessage(),
                message.getStatus(),
                message.getReceivedAt(),
                message.getReadAt()
        );
    }

    public ContactMessage toDomain(ContactMessageEntity entity) {
        if (entity == null) {
            return null;
        }

        return new ContactMessage(
                entity.getId(),
                entity.getSenderName(),
                entity.getSenderEmail(),
                entity.getSubject(),
                entity.getMessage(),
                entity.getStatus(),
                entity.getReceivedAt(),
                entity.getReadAt()
        );
    }
}