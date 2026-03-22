package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.ResumeContent;
import com.portfolio.portfolio_backend.domain.port.out.ResumeContentRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeContentService {

    private final ResumeContentRepositoryPort resumeContentRepositoryPort;
    private final ResumeStorageService resumeStorageService;

    public ResumeContentService(
            ResumeContentRepositoryPort resumeContentRepositoryPort,
            ResumeStorageService resumeStorageService
    ) {
        this.resumeContentRepositoryPort = resumeContentRepositoryPort;
        this.resumeStorageService = resumeStorageService;
    }

    @Transactional(readOnly = true)
    public ResumeContent get() {
        return resumeContentRepositoryPort.find()
                .orElseGet(() -> new ResumeContent(null, null));
    }

    @Transactional
    public ResumeContent upload(MultipartFile file) {
        ResumeContent current = get();

        String newUrl = resumeStorageService.store(file);
        String originalFileName = sanitizeOriginalFileName(file.getOriginalFilename());

        if (current.getFileUrl() != null && !current.getFileUrl().isBlank()) {
            resumeStorageService.delete(current.getFileUrl());
        }

        ResumeContent updated = new ResumeContent(newUrl, originalFileName);
        return resumeContentRepositoryPort.save(updated);
    }

    private String sanitizeOriginalFileName(String value) {
        String sanitized = StringUtils.cleanPath(value == null ? "resume.pdf" : value).trim();

        if (sanitized.length() > 255) {
            sanitized = sanitized.substring(0, 255);
        }

        return sanitized;
    }
}