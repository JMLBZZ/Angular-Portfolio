package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ResumeContentService;
import com.portfolio.portfolio_backend.domain.model.ResumeContent;
import com.portfolio.portfolio_backend.web.dto.ResumeContentResponseDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/resume")
public class PublicResumeController {

    private final ResumeContentService resumeContentService;

    public PublicResumeController(ResumeContentService resumeContentService) {
        this.resumeContentService = resumeContentService;
    }

    @GetMapping
    public ResumeContentResponseDTO get() {
        ResumeContent resumeContent = resumeContentService.get();

        return new ResumeContentResponseDTO(
                resumeContent.getFileUrl(),
                resumeContent.getOriginalFileName()
        );
    }
}