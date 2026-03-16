package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectImageStorageService;
import com.portfolio.portfolio_backend.web.dto.UploadedImageResponseDTO;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/project-images")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProjectImageController {

    private final ProjectImageStorageService projectImageStorageService;

    public AdminProjectImageController(ProjectImageStorageService projectImageStorageService) {
        this.projectImageStorageService = projectImageStorageService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public UploadedImageResponseDTO upload(
            @RequestPart("file") @NotNull MultipartFile file
    ) {
        String url = projectImageStorageService.store(file);
        return new UploadedImageResponseDTO(url);
    }
}