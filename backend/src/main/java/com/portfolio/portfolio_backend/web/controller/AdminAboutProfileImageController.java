package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ProfileImageStorageService;
import com.portfolio.portfolio_backend.web.dto.UploadedImageResponseDTO;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/about/profile-image")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAboutProfileImageController {

    private final ProfileImageStorageService profileImageStorageService;

    public AdminAboutProfileImageController(ProfileImageStorageService profileImageStorageService) {
        this.profileImageStorageService = profileImageStorageService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public UploadedImageResponseDTO upload(
            @RequestPart("file") @NotNull MultipartFile file
    ) {
        String url = profileImageStorageService.store(file);
        return new UploadedImageResponseDTO(url);
    }
}