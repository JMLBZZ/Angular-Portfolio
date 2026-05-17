package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contact_message_entity")
public class ContactMessageEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 80)
    private String senderName;

    @Column(nullable = false, length = 120)
    private String senderEmail;

    @Column(nullable = false, length = 120)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContactMessageStatus status;

    @Column(nullable = false)
    private Instant receivedAt;

    private Instant readAt;

    public ContactMessageEntity() {
    }

    public ContactMessageEntity(
            UUID id,
            String senderName,
            String senderEmail,
            String subject,
            String message,
            ContactMessageStatus status,
            Instant receivedAt,
            Instant readAt
    ) {
        this.id = id;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.subject = subject;
        this.message = message;
        this.status = status;
        this.receivedAt = receivedAt;
        this.readAt = readAt;
    }

    public UUID getId() {
        return id;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }

    public ContactMessageStatus getStatus() {
        return status;
    }

    public Instant getReceivedAt() {
        return receivedAt;
    }

    public Instant getReadAt() {
        return readAt;
    }
}