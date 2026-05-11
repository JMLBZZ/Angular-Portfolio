package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class LegalContentRequestDTO {

    @Valid
    @NotNull(message = "Le titre est obligatoire")
    private LocalizedTextDTO title;

    @Valid
    @NotNull(message = "Le contenu est obligatoire")
    private LegalHtmlContentDTO content;

    public LegalContentRequestDTO() {
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LegalHtmlContentDTO getContent() {
        return content;
    }
}