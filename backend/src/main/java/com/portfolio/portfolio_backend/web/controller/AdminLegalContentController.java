package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.LegalContentService;
import com.portfolio.portfolio_backend.domain.model.LegalContent;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.LegalContentRequestDTO;
import com.portfolio.portfolio_backend.web.dto.LegalContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LegalHtmlContentDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/legal")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLegalContentController {

    private final LegalContentService legalContentService;

    public AdminLegalContentController(LegalContentService legalContentService) {
        this.legalContentService = legalContentService;
    }

    @GetMapping
    public LegalContentResponseDTO get() {
        return toResponse(legalContentService.get());
    }

    @PutMapping
    public LegalContentResponseDTO update(@Valid @RequestBody LegalContentRequestDTO dto) {
        LegalContent updatedLegalContent = legalContentService.update(toDomain(dto));
        return toResponse(updatedLegalContent);
    }

    private LegalContent toDomain(LegalContentRequestDTO dto) {
        return new LegalContent(
                toLocalizedText(dto.getTitle()),
                toLocalizedText(dto.getContent())
        );
    }

    private LegalContentResponseDTO toResponse(LegalContent legalContent) {
        return new LegalContentResponseDTO(
                toLocalizedTextDTO(legalContent.getTitle()),
                toLegalHtmlContentDTO(legalContent.getContent())
        );
    }

    private LocalizedText toLocalizedText(LocalizedTextDTO dto) {
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedText toLocalizedText(LegalHtmlContentDTO dto) {
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }

    private LegalHtmlContentDTO toLegalHtmlContentDTO(LocalizedText localizedText) {
        return new LegalHtmlContentDTO(localizedText.getFr(), localizedText.getEn());
    }
}