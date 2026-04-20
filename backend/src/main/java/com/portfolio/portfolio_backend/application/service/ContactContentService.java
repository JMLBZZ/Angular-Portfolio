package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Contact;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.port.out.ContactRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactContentService {

    private final ContactRepositoryPort contactRepositoryPort;

    public ContactContentService(ContactRepositoryPort contactRepositoryPort) {
        this.contactRepositoryPort = contactRepositoryPort;
    }

    @Transactional(readOnly = true)
    public Contact get() {
        return contactRepositoryPort.find().orElseGet(this::buildDefaultContact);
    }

    @Transactional
    public Contact update(Contact contact) {
        Contact sanitizedContact = new Contact(
                sanitizeLocalizedText(contact.getTitle()),
                sanitizeLocalizedText(contact.getSubtitle()),
                sanitize(contact.getEmail(), 160),
                sanitize(contact.getPhone(), 80),
                sanitize(contact.getLocation(), 160),
                sanitize(contact.getLinkedinUrl(), 255),
                sanitize(contact.getGithubUrl(), 255)
        );

        return contactRepositoryPort.save(sanitizedContact);
    }

    private Contact buildDefaultContact() {
        return new Contact(
                new LocalizedText("Contact", "Contact"),
                new LocalizedText(
                        "Discutons de votre prochain projet",
                        "Let’s talk about your next project"
                ),
                "contact@mail.com",
                "+33 6 12 34 56 78",
                "Paris, France",
                "https://www.linkedin.com/",
                "https://github.com/"
        );
    }

    private LocalizedText sanitizeLocalizedText(LocalizedText text) {
        if (text == null) {
            return new LocalizedText("", "");
        }

        return new LocalizedText(
                sanitize(text.getFr(), 255),
                sanitize(text.getEn(), 255)
        );
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