package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.application.exception.FileStorageException;
import com.portfolio.portfolio_backend.application.service.LogoImageStorageService;
import com.portfolio.portfolio_backend.infrastructure.external.cloudinary.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@Service
public class LocalLogoImageStorageService implements LogoImageStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/svg+xml",
            "image/png",
            "image/jpeg",
            "image/gif"
    );

    private final CloudinaryService cloudinaryService;

    public LocalLogoImageStorageService(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public String store(MultipartFile file) {
        validate(file);

        try {
            return cloudinaryService.uploadLogo(file.getBytes());
        } catch (IOException ex) {
            throw new FileStorageException("Impossible d'envoyer le logo vers Cloudinary.", ex);
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

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new FileStorageException("Formats autorisés : SVG, PNG, JPG, JPEG ou GIF.");
        }

        if ("image/svg+xml".equalsIgnoreCase(contentType)) {
            validateSvgFile(file);
        }
    }

    private void validateSvgFile(MultipartFile file) {
        try {
            String svgContent = new String(file.getBytes(), StandardCharsets.UTF_8).toLowerCase();

            if (!svgContent.contains("<svg")) {
                throw new FileStorageException("Le fichier SVG doit contenir une balise <svg>.");
            }

            if (
                    svgContent.contains("<script") ||
                    svgContent.contains("javascript:") ||
                    svgContent.matches("(?s).*\\son[a-z]+\\s*=.*")
            ) {
                throw new FileStorageException("Le fichier SVG contient du contenu non autorisé.");
            }
        } catch (IOException ex) {
            throw new FileStorageException("Impossible de lire le fichier SVG.", ex);
        }
    }
}