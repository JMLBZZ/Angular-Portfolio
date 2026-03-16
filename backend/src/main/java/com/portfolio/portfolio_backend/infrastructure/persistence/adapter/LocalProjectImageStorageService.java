package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.application.exception.FileStorageException;
import com.portfolio.portfolio_backend.application.service.ProjectImageStorageService;
import com.portfolio.portfolio_backend.infrastructure.config.UploadProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalProjectImageStorageService implements ProjectImageStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final UploadProperties uploadProperties;

    public LocalProjectImageStorageService(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public String store(MultipartFile file) {
        validate(file);

        try {
            Path baseDir = Paths.get(uploadProperties.dir(), uploadProperties.projectsSubdir())
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(baseDir);

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
            String extension = extractExtension(originalFilename);
            String storedFileName = UUID.randomUUID() + extension;

            Path target = baseDir.resolve(storedFileName).normalize();

            file.transferTo(target);

            return "/uploads/" + uploadProperties.projectsSubdir() + "/" + storedFileName;
        } catch (IOException ex) {
            throw new FileStorageException("Impossible d'enregistrer le fichier.", ex);
        }
    }

    @Override
    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        if (!fileUrl.startsWith("/uploads/" + uploadProperties.projectsSubdir() + "/")) {
            return;
        }

        try {
            String filename = fileUrl.substring(("/uploads/" + uploadProperties.projectsSubdir() + "/").length());
            Path filePath = Paths.get(uploadProperties.dir(), uploadProperties.projectsSubdir(), filename)
                    .toAbsolutePath()
                    .normalize();

            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Impossible de supprimer le fichier.", ex);
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
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new FileStorageException("Seules les images sont autorisées.");
        }
    }

    private String extractExtension(String filename) {
        int index = filename.lastIndexOf('.');
        if (index < 0) {
            return "";
        }
        return filename.substring(index).toLowerCase();
    }
}