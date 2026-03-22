package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ResumeContentService;
import com.portfolio.portfolio_backend.domain.model.ResumeContent;
import com.portfolio.portfolio_backend.web.dto.ResumeContentResponseDTO;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/resume")
@PreAuthorize("hasRole('ADMIN')")
public class AdminResumeController {

    private final ResumeContentService resumeContentService;

    public AdminResumeController(ResumeContentService resumeContentService) {
        this.resumeContentService = resumeContentService;
    }

    @GetMapping
    public ResumeContentResponseDTO get() {
        return toResponse(resumeContentService.get());
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResumeContentResponseDTO upload(
            @RequestPart("file") @NotNull MultipartFile file
    ) {
        return toResponse(resumeContentService.upload(file));
    }

    private ResumeContentResponseDTO toResponse(ResumeContent resumeContent) {
        return new ResumeContentResponseDTO(
                resumeContent.getFileUrl(),
                resumeContent.getOriginalFileName()
        );
    }
}