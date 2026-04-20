package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.TranslationService;
import com.portfolio.portfolio_backend.web.dto.TranslationRequestDTO;
import com.portfolio.portfolio_backend.web.dto.TranslationResponseDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/translations")
@PreAuthorize("hasRole('ADMIN')")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping("/fr-to-en")
    public TranslationResponseDTO translateFrToEn(@Valid @RequestBody TranslationRequestDTO dto) {
        return new TranslationResponseDTO(
                translationService.translateFrToEn(dto.getFields())
        );
    }
}