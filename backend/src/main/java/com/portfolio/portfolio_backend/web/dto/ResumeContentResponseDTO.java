package com.portfolio.portfolio_backend.web.dto;

public class ResumeContentResponseDTO {

    private final String fileUrl;
    private final String originalFileName;

    public ResumeContentResponseDTO(String fileUrl, String originalFileName) {
        this.fileUrl = fileUrl;
        this.originalFileName = originalFileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }
}