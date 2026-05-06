package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.application.exception.FileStorageException;
import com.portfolio.portfolio_backend.application.service.ResumeStorageService;
import com.portfolio.portfolio_backend.infrastructure.external.cloudinary.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class LocalResumeStorageService implements ResumeStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final CloudinaryService cloudinaryService;

    public LocalResumeStorageService(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public String store(MultipartFile file) {
        validate(file);

        try {
            return cloudinaryService.uploadPdf(file.getBytes());
        } catch (IOException ex) {
            throw new FileStorageException("Impossible d'envoyer le CV vers Cloudinary.", ex);
        }
    }

    @Override
    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            cloudinaryService.deleteRawFile(fileUrl);
        } catch (IOException ex) {
            throw new FileStorageException("Impossible de supprimer l'ancien CV Cloudinary.", ex);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Le fichier est vide.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("Le fichier dépasse la taille maximale autorisée de 10 MB.");
        }

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();

        boolean isPdfContentType = "application/pdf".equalsIgnoreCase(contentType);
        boolean isPdfExtension = originalFilename.endsWith(".pdf");

        if (!isPdfContentType && !isPdfExtension) {
            throw new FileStorageException("Seuls les fichiers PDF sont autorisés.");
        }
    }
}