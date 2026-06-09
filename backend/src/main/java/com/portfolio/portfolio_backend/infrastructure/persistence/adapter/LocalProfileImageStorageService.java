package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.application.exception.FileStorageException;
import com.portfolio.portfolio_backend.application.service.ProfileImageStorageService;
import com.portfolio.portfolio_backend.infrastructure.external.cloudinary.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class LocalProfileImageStorageService implements ProfileImageStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final CloudinaryService cloudinaryService;

    public LocalProfileImageStorageService(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public String store(MultipartFile file) {
        validate(file);

        try {
            return cloudinaryService.uploadProfileImage(file.getBytes());
        } catch (IOException ex) {
            throw new FileStorageException("Impossible d'envoyer la photo de profil vers Cloudinary.", ex);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Le fichier est vide.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("Le fichier dépasse la taille maximale autorisée de 5 MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new FileStorageException("Seules les images sont autorisées.");
        }
    }
}