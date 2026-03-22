package com.portfolio.portfolio_backend.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "resume_content")
public class ResumeContentEntity {

    @Id
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    @Column(length = 255)
    private String originalFileName;

    public ResumeContentEntity() {
    }

    public ResumeContentEntity(Long id, String fileUrl, String originalFileName) {
        this.id = id;
        this.fileUrl = fileUrl;
        this.originalFileName = originalFileName;
    }

    public Long getId() {
        return id;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }
}