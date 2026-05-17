package com.portfolio.portfolio_backend.domain.model;

import java.time.Instant;
import java.util.UUID;

public class ContactMessage {

    private UUID id;
    private String senderName;
    private String senderEmail;
    private String subject;
    private String message;
    private ContactMessageStatus status;
    private Instant receivedAt;
    private Instant readAt;

    public ContactMessage(
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