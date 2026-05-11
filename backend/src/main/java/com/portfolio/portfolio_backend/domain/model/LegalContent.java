package com.portfolio.portfolio_backend.domain.model;

public class LegalContent {

    private LocalizedText title;
    private LocalizedText content;

    public LegalContent(
            LocalizedText title,
            LocalizedText content
    ) {
        this.title = title;
        this.content = content;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getContent() {
        return content;
    }
}