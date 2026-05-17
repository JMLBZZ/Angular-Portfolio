package com.portfolio.portfolio_backend.web.dto;

import java.time.Instant;
import java.util.UUID;

public class ContactMessageResponseDTO {

    private UUID id;
    private String senderName;
    private String senderEmail;
    private String subject;
    private String message;
    private String status;
    private Instant receivedAt;
    private Instant readAt;

    public ContactMessageResponseDTO(
            UUID id,
            String senderName,
            String senderEmail,
            String subject,
            String message,
            String status,
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

    public String getStatus() {
        return status;
    }

    public Instant getReceivedAt() {
        return receivedAt;
    }

    public Instant getReadAt() {
        return readAt;
    }
}