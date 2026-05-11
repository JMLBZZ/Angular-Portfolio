package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.LegalContentService;
import com.portfolio.portfolio_backend.domain.model.LegalContent;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.web.dto.LegalContentResponseDTO;
import com.portfolio.portfolio_backend.web.dto.LegalHtmlContentDTO;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/legal")
public class PublicLegalContentController {

    private final LegalContentService legalContentService;

    public PublicLegalContentController(LegalContentService legalContentService) {
        this.legalContentService = legalContentService;
    }

    @GetMapping
    public LegalContentResponseDTO get() {
        return toResponse(legalContentService.get());
    }

    private LegalContentResponseDTO toResponse(LegalContent legalContent) {
        return new LegalContentResponseDTO(
                toLocalizedTextDTO(legalContent.getTitle()),
                toLegalHtmlContentDTO(legalContent.getContent())
        );
    }

    private LocalizedTextDTO toLocalizedTextDTO(LocalizedText localizedText) {
        return new LocalizedTextDTO(localizedText.getFr(), localizedText.getEn());
    }

    private LegalHtmlContentDTO toLegalHtmlContentDTO(LocalizedText localizedText) {
        return new LegalHtmlContentDTO(localizedText.getFr(), localizedText.getEn());
    }
}