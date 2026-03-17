package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ContactContentService;
import com.portfolio.portfolio_backend.domain.model.Contact;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.ContactContentRequestDTO;
import com.portfolio.portfolio_backend.web.dto.ContactContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/contact")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactController {

    private final ContactContentService contactContentService;

    public AdminContactController(ContactContentService contactContentService) {
        this.contactContentService = contactContentService;
    }

    @GetMapping
    public ContactContentResponseDTO get() {
        return toResponse(contactContentService.get());
    }

    @PutMapping
    public ContactContentResponseDTO update(@Valid @RequestBody ContactContentRequestDTO dto) {
        Contact updatedContact = contactContentService.update(toDomain(dto));
        return toResponse(updatedContact);
    }

    private Contact toDomain(ContactContentRequestDTO dto) {
        return new Contact(
                toLocalizedText(dto.getTitle()),
                toLocalizedText(dto.getSubtitle()),
                dto.getEmail(),
                dto.getPhone(),
                dto.getLocation(),
                dto.getLinkedinUrl(),
                dto.getGithubUrl()
        );
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

    private LocalizedText toLocalizedText(LocalizedTextDTO dto) {
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }
}