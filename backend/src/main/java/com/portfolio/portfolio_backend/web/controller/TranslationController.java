package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.TranslationRateLimiter;
import com.portfolio.portfolio_backend.application.service.TranslationService;
import com.portfolio.portfolio_backend.web.dto.TranslationRequestDTO;
import com.portfolio.portfolio_backend.web.dto.TranslationResponseDTO;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/translations")
@PreAuthorize("hasRole('ADMIN')")
public class TranslationController {

    private final TranslationService translationService;
    private final TranslationRateLimiter translationRateLimiter;

    public TranslationController(
            TranslationService translationService,
            TranslationRateLimiter translationRateLimiter
    ) {
        this.translationService = translationService;
        this.translationRateLimiter = translationRateLimiter;
    }

    @PostMapping("/fr-to-en")
    public TranslationResponseDTO translateFrToEn(
            @Valid @RequestBody TranslationRequestDTO dto,
            Authentication authentication
    ) {
        translationRateLimiter.checkLimit(resolveUserKey(authentication));

        return new TranslationResponseDTO(
                translationService.translateFrToEn(dto.getFields())
        );
    }

    private String resolveUserKey(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return "";
        }

        return authentication.getName();
    }
}