package com.portfolio.portfolio_backend.web.dto;

public class LegalContentResponseDTO {

    private LocalizedTextDTO title;
    private LegalHtmlContentDTO content;

    public LegalContentResponseDTO(
            LocalizedTextDTO title,
            LegalHtmlContentDTO content
    ) {
        this.title = title;
        this.content = content;
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LegalHtmlContentDTO getContent() {
        return content;
    }
}