package com.portfolio.portfolio_backend.domain.model;

public class ResumeContent {

    private String fileUrl;
    private String originalFileName;

    public ResumeContent(String fileUrl, String originalFileName) {
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