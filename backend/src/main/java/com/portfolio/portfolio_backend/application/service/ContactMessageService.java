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
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class ContactMessageService {

    private static final int MAX_BULK_IDS = 100;

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
    public Page<ContactMessage> getAll(String status, String query, Pageable pageable) {
        ContactMessageStatus parsedStatus = parseStatus(status);

        return repository.search(parsedStatus, sanitizeSearchQuery(query), pageable);
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

        ContactMessage updated = buildUpdatedMessage(existing, ContactMessageStatus.READ);

        return repository.save(updated);
    }

    @Transactional
    public ContactMessage markAsUnread(UUID id) {
        ContactMessage existing = getById(id);

        ContactMessage updated = buildUpdatedMessage(existing, ContactMessageStatus.UNREAD);

        return repository.save(updated);
    }

    @Transactional
    public ContactMessage archive(UUID id) {
        ContactMessage existing = getById(id);

        ContactMessage updated = buildUpdatedMessage(existing, ContactMessageStatus.ARCHIVED);

        return repository.save(updated);
    }

    @Transactional
    public List<ContactMessage> markAsRead(List<UUID> ids) {
        return updateStatus(ids, ContactMessageStatus.READ);
    }

    @Transactional
    public List<ContactMessage> markAsUnread(List<UUID> ids) {
        return updateStatus(ids, ContactMessageStatus.UNREAD);
    }

    @Transactional
    public List<ContactMessage> archive(List<UUID> ids) {
        return updateStatus(ids, ContactMessageStatus.ARCHIVED);
    }

    @Transactional
    public void delete(UUID id) {
        if (repository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Contact message not found");
        }

        repository.deleteById(id);
    }

    @Transactional
    public void delete(List<UUID> ids) {
        List<UUID> normalizedIds = normalizeBulkIds(ids);
        ensureAllMessagesExist(normalizedIds);

        repository.deleteAllByIds(normalizedIds);
    }

    private List<ContactMessage> updateStatus(List<UUID> ids, ContactMessageStatus status) {
        List<UUID> normalizedIds = normalizeBulkIds(ids);
        List<ContactMessage> existingMessages = findExistingMessagesOrThrow(normalizedIds);

        List<ContactMessage> updatedMessages = existingMessages.stream()
                .map(message -> buildUpdatedMessage(message, status))
                .toList();

        return repository.saveAll(updatedMessages);
    }

    private List<ContactMessage> findExistingMessagesOrThrow(List<UUID> ids) {
        List<ContactMessage> messages = repository.findAllByIds(ids);

        if (messages.size() != ids.size()) {
            throw new ResourceNotFoundException("One or more contact messages were not found");
        }

        return messages;
    }

    private void ensureAllMessagesExist(List<UUID> ids) {
        findExistingMessagesOrThrow(ids);
    }

    private List<UUID> normalizeBulkIds(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("At least one message id is required");
        }

        Set<UUID> uniqueIds = new LinkedHashSet<>(ids);

        if (uniqueIds.contains(null)) {
            throw new IllegalArgumentException("Message ids cannot contain null values");
        }

        if (uniqueIds.size() > MAX_BULK_IDS) {
            throw new IllegalArgumentException("Too many messages selected");
        }

        return uniqueIds.stream().toList();
    }

    private ContactMessage buildUpdatedMessage(ContactMessage existing, ContactMessageStatus status) {
        Instant readAt = switch (status) {
            case READ, ARCHIVED -> existing.getReadAt() != null ? existing.getReadAt() : Instant.now();
            case UNREAD -> null;
        };

        return new ContactMessage(
                existing.getId(),
                existing.getSenderName(),
                existing.getSenderEmail(),
                existing.getSubject(),
                existing.getMessage(),
                status,
                existing.getReceivedAt(),
                readAt
        );
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

    private String sanitizeSearchQuery(String input) {
        return sanitize(input, 120).replaceAll("\\s+", " ");
    }
}