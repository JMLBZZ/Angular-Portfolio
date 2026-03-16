package com.portfolio.portfolio_backend.application.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProjectImageStorageService {
    String store(MultipartFile file);
    void delete(String fileUrl);
}