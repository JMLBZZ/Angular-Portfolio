package com.portfolio.portfolio_backend.web.dto;

public class UploadedImageResponseDTO {

    private final String url;

    public UploadedImageResponseDTO(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
}