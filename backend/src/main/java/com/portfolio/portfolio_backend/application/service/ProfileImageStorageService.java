package com.portfolio.portfolio_backend.application.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProfileImageStorageService {
    String store(MultipartFile file);
}