package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStats;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import com.portfolio.portfolio_backend.domain.port.out.ContactMessageRepositoryPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
public class ContactMessageService {

    private final ContactMessageRepositoryPort repository;

    public ContactMessageService(ContactMessageRepositoryPort repository) {
        this.repository = repository;
    }

    @Transactional
    public ContactMessage saveIncomingMessage(
            String senderName,
            String senderEmail,
            String subject,
            String message
    ) {
        ContactMessage contactMessage = new ContactMessage(
                UUID.randomUUID(),
                sanitize(senderName, 80),
                sanitize(senderEmail, 120),
                sanitize(subject, 120),
                sanitize(message, 4000),
                ContactMessageStatus.UNREAD,
                Instant.now(),
                null
        );

        return repository.save(contactMessage);
    }

    @Transactional(readOnly = true)
    public Page<ContactMessage> getAll(String status, Pageable pageable) {
        ContactMessageStatus parsedStatus = parseStatus(status);

        if (parsedStatus == null) {
            return repository.findAll(pageable);
        }

        return repository.findByStatus(parsedStatus, pageable);
    }

    @Transactional(readOnly = true)
    public ContactMessage getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found"));
    }

    @Transactional(readOnly = true)
    public ContactMessageStats getStats() {
        return new ContactMessageStats(
                repository.countAll(),
                repository.countByStatus(ContactMessageStatus.UNREAD),
                repository.countByStatus(ContactMessageStatus.READ),
                repository.countByStatus(ContactMessageStatus.ARCHIVED)
        );
    }

    @Transactional
    public ContactMessage markAsRead(UUID id) {
        ContactMessage existing = getById(id);

        ContactMessage updated = new ContactMessage(
                existing.getId(),
                existing.getSenderName(),
                existing.getSenderEmail(),
                existing.getSubject(),
                existing.getMessage(),
                ContactMessageStatus.READ,
                existing.getReceivedAt(),
                existing.getReadAt() != null ? existing.getReadAt() : Instant.now()
        );

        return repository.save(updated);
    }

    @Transactional
    public ContactMessage markAsUnread(UUID id) {
        ContactMessage existing = getById(id);

        ContactMessage updated = new ContactMessage(
                existing.getId(),
                existing.getSenderName(),
                existing.getSenderEmail(),
                existing.getSubject(),
                existing.getMessage(),
                ContactMessageStatus.UNREAD,
                existing.getReceivedAt(),
                null
        );

        return repository.save(updated);
    }

    @Transactional
    public ContactMessage archive(UUID id) {
        ContactMessage existing = getById(id);

        ContactMessage updated = new ContactMessage(
                existing.getId(),
                existing.getSenderName(),
                existing.getSenderEmail(),
                existing.getSubject(),
                existing.getMessage(),
                ContactMessageStatus.ARCHIVED,
                existing.getReceivedAt(),
                existing.getReadAt() != null ? existing.getReadAt() : Instant.now()
        );

        return repository.save(updated);
    }

    @Transactional
    public void delete(UUID id) {
        if (repository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Contact message not found");
        }

        repository.deleteById(id);
    }

    private ContactMessageStatus parseStatus(String status) {
        if (status == null || status.isBlank() || "all".equalsIgnoreCase(status.trim())) {
            return null;
        }

        try {
            return ContactMessageStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid message status");
        }
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