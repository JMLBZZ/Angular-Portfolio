package com.portfolio.portfolio_backend.infrastructure.external.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${CLOUDINARY_CLOUD_NAME}") String cloudName,
            @Value("${CLOUDINARY_API_KEY}") String apiKey,
            @Value("${CLOUDINARY_API_SECRET}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    public String uploadImage(byte[] fileBytes) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap(
                "folder", "portfolio/projects",
                "resource_type", "image"
        ));

        return uploadResult.get("secure_url").toString();
    }

    public String uploadPdf(byte[] fileBytes, String originalFilename) throws IOException {

        String fileNameWithoutExtension = originalFilename
                .replaceAll("\\.pdf$", "")
                .replaceAll("[^a-zA-Z0-9-_]", "_")
                .toLowerCase();

        Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap(
                "folder", "portfolio/resumes",
                "resource_type", "raw",
                "public_id", fileNameWithoutExtension,
                "format", "pdf",
                "use_filename", true,
                "unique_filename", false
        ));

        return uploadResult.get("secure_url").toString();
    }

    public void deleteImage(String fileUrl) throws IOException {
        String publicId = extractPublicId(fileUrl, false);

        if (publicId == null) {
            return;
        }

        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                "resource_type", "image"
        ));
    }

    public void deleteRawFile(String fileUrl) throws IOException {
        String publicId = extractPublicId(fileUrl, true);

        if (publicId == null) {
            return;
        }

        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                "resource_type", "raw"
        ));
    }

    private String extractPublicId(String fileUrl, boolean keepExtension) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return null;
        }

        if (!fileUrl.contains("res.cloudinary.com") || !fileUrl.contains("/upload/")) {
            return null;
        }

        String afterUpload = fileUrl.substring(fileUrl.indexOf("/upload/") + "/upload/".length());

        if (afterUpload.startsWith("v")) {
            int firstSlashIndex = afterUpload.indexOf('/');
            if (firstSlashIndex >= 0) {
                afterUpload = afterUpload.substring(firstSlashIndex + 1);
            }
        }

        if (!keepExtension) {
            int dotIndex = afterUpload.lastIndexOf('.');
            if (dotIndex > 0) {
                afterUpload = afterUpload.substring(0, dotIndex);
            }
        }

        return afterUpload;
    }
}