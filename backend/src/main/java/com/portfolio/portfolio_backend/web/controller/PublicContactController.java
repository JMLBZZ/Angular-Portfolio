package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ContactContentService;
import com.portfolio.portfolio_backend.domain.model.Contact;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.ContactContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/contact")
public class PublicContactController {

    private final ContactContentService contactContentService;

    public PublicContactController(ContactContentService contactContentService) {
        this.contactContentService = contactContentService;
    }

    @GetMapping
    public ContactContentResponseDTO get() {
        return toResponse(contactContentService.get());
    }

    private ContactContentResponseDTO toResponse(Contact contact) {
        return new ContactContentResponseDTO(
                toLocalizedTextDTO(contact.getTitle()),
                toLocalizedTextDTO(contact.getSubtitle()),
                contact.getEmail(),
                contact.getPhone(),
                contact.getLocation(),
                contact.getLinkedinUrl(),
                contact.getGithubUrl()
        );
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }
}