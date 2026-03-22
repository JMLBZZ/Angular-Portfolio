package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.application.exception.FileStorageException;
import com.portfolio.portfolio_backend.application.service.ResumeStorageService;
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
public class LocalResumeStorageService implements ResumeStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final UploadProperties uploadProperties;

    public LocalResumeStorageService(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public String store(MultipartFile file) {
        validate(file);

        try {
            Path baseDir = Paths.get(uploadProperties.dir(), uploadProperties.resumesSubdir())
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(baseDir);

            String originalFilename = StringUtils.cleanPath(
                    file.getOriginalFilename() == null ? "resume.pdf" : file.getOriginalFilename()
            );

            String extension = extractExtension(originalFilename);
            String storedFileName = UUID.randomUUID() + extension;

            Path target = baseDir.resolve(storedFileName).normalize();

            file.transferTo(target);

            return "/uploads/" + uploadProperties.resumesSubdir() + "/" + storedFileName;
        } catch (IOException ex) {
            throw new FileStorageException("Impossible d'enregistrer le CV.", ex);
        }
    }

    @Override
    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        String expectedPrefix = "/uploads/" + uploadProperties.resumesSubdir() + "/";
        if (!fileUrl.startsWith(expectedPrefix)) {
            return;
        }

        try {
            String filename = fileUrl.substring(expectedPrefix.length());
            Path filePath = Paths.get(uploadProperties.dir(), uploadProperties.resumesSubdir(), filename)
                    .toAbsolutePath()
                    .normalize();

            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Impossible de supprimer l'ancien CV.", ex);
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

    private String extractExtension(String filename) {
        int index = filename.lastIndexOf('.');
        if (index < 0) {
            return ".pdf";
        }
        return filename.substring(index).toLowerCase();
    }
}