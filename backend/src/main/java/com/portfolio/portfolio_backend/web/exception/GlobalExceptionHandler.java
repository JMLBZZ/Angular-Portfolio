package com.portfolio.portfolio_backend.web.exception;

import com.portfolio.portfolio_backend.application.exception.FileStorageException;
import com.portfolio.portfolio_backend.application.exception.RateLimitException;
import com.portfolio.portfolio_backend.application.exception.SpamDetectedException;
import com.portfolio.portfolio_backend.application.exception.TranslationException;
import com.portfolio.portfolio_backend.domain.exception.EmailAlreadyUsedException;
import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.exception.SlugAlreadyUsedException;
import com.portfolio.portfolio_backend.web.response.ApiError;
import com.portfolio.portfolio_backend.web.response.ApiResult;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mail.MailException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Gestion des ressources non trouvées (404)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResult<?>> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {
        logger.warn("Resource not found: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                "NOT_FOUND",
                null,
                request
        );
    }

    /**
     * Gestion des erreurs de validation (400)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResult<?>> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> {
                    String fieldName = ValidationFieldPathMapper.toFrontendFieldPath(error.getField());
                    errors.putIfAbsent(fieldName, error.getDefaultMessage());
                });

        ex.getBindingResult()
                .getGlobalErrors()
                .forEach(error -> {
                    String objectName = ValidationFieldPathMapper.toFrontendFieldPath(error.getObjectName());
                    errors.putIfAbsent(objectName, error.getDefaultMessage());
                });

        logger.warn("Validation failed: {}", errors);

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                "VALIDATION_ERROR",
                errors,
                request
        );
    }

    /**
     * Gestion des violations de contraintes sur paramètres / path variables / request parts (400)
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResult<?>> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String rawPath = violation.getPropertyPath() == null
                    ? ""
                    : violation.getPropertyPath().toString();

            String field = ValidationFieldPathMapper.toFrontendFieldPath(rawPath);
            errors.putIfAbsent(field, violation.getMessage());
        }

        logger.warn("Constraint violation: {}", errors);

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                "VALIDATION_ERROR",
                errors,
                request
        );
    }

    /**
     * Gestion des UUID invalides, paramètres mal typés, etc. (400)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResult<?>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request
    ) {
        Map<String, String> details = new LinkedHashMap<>();
        details.put(ex.getName(), "La valeur fournie est invalide.");

        logger.warn("Type mismatch on parameter '{}': {}", ex.getName(), ex.getMessage());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "La requête envoyée est invalide.",
                "INVALID_REQUEST",
                details,
                request
        );
    }

    /**
     * Gestion des JSON mal formés ou payloads illisibles (400)
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResult<?>> handleUnreadableMessage(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        logger.warn("Unreadable HTTP message: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Le contenu envoyé est invalide ou mal formé.",
                "INVALID_REQUEST_BODY",
                null,
                request
        );
    }

    /**
     * Gestion des parties multipart manquantes (400)
     */
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiResult<?>> handleMissingRequestPart(
            MissingServletRequestPartException ex,
            HttpServletRequest request
    ) {
        Map<String, String> details = new LinkedHashMap<>();
        details.put(ex.getRequestPartName(), "Cette partie du formulaire est obligatoire.");

        logger.warn("Missing request part: {}", ex.getRequestPartName());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Le formulaire envoyé est incomplet.",
                "MISSING_REQUEST_PART",
                details,
                request
        );
    }

    /**
     * Gestion des paramètres métier invalides (400)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResult<?>> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        logger.warn("Illegal argument: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                "INVALID_REQUEST",
                null,
                request
        );
    }

    /**
     * Gestion de conflit des emails déjà utilisés (409)
     */
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ApiResult<?>> handleEmailAlreadyUsed(
            EmailAlreadyUsedException ex,
            HttpServletRequest request
    ) {
        logger.warn("Email already used: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                "EMAIL_ALREADY_USED",
                null,
                request
        );
    }

    /**
     * Gestion de conflit des slugs déjà utilisés (409)
     */
    @ExceptionHandler(SlugAlreadyUsedException.class)
    public ResponseEntity<ApiResult<?>> handleSlugAlreadyUsed(
            SlugAlreadyUsedException ex,
            HttpServletRequest request
    ) {
        logger.warn("Slug already used: {}", ex.getMessage());

        Map<String, String> details = new LinkedHashMap<>();
        details.put("slug", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                "SLUG_ALREADY_USED",
                details,
                request
        );
    }

    /**
     * Gestion du spam détecté (400)
     */
    @ExceptionHandler(SpamDetectedException.class)
    public ResponseEntity<ApiResult<?>> handleSpamDetected(
            SpamDetectedException ex,
            HttpServletRequest request
    ) {
        logger.warn("Spam detected: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                "SPAM_DETECTED",
                null,
                request
        );
    }

    /**
     * Gestion du rate limit (429)
     */
    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ApiResult<?>> handleRateLimit(
            RateLimitException ex,
            HttpServletRequest request
    ) {
        logger.warn("Rate limit triggered: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.TOO_MANY_REQUESTS,
                ex.getMessage(),
                "RATE_LIMIT",
                null,
                request
        );
    }

    /**
     * Gestion des erreurs SMTP / email (500)
     */
    @ExceptionHandler(MailException.class)
    public ResponseEntity<ApiResult<?>> handleMailException(
            MailException ex,
            HttpServletRequest request
    ) {
        logger.error("Mail sending failed", ex);

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Email sending failed",
                "SMTP_ERROR",
                null,
                request
        );
    }


    /**
     * Gestion des erreurs de traduction (503)
     */
    @ExceptionHandler(TranslationException.class)
    public ResponseEntity<ApiResult<?>> handleTranslationException(
            TranslationException ex,
            HttpServletRequest request
    ) {
        logger.warn("Translation error: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                ex.getMessage(),
                "TRANSLATION_ERROR",
                null,
                request
        );
    }

    /**
     * Gestion générique des erreurs upload
     */
    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ApiResult<?>> handleFileStorageException(
            FileStorageException ex,
            HttpServletRequest request
    ) {
        logger.warn("File storage error: {}", ex.getMessage());

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                "FILE_STORAGE_ERROR",
                null,
                request
        );
    }

    /**
     * Gestion générique des erreurs backend (500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResult<?>> handleGenericException(
            Exception ex,
            HttpServletRequest request
    ) {
        logger.error("Unexpected backend error", ex);

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error",
                "INTERNAL_ERROR",
                null,
                request
        );
    }

    private ResponseEntity<ApiResult<?>> buildErrorResponse(
            HttpStatus status,
            String message,
            String code,
            Map<String, String> details,
            HttpServletRequest request
    ) {
        ApiError error = new ApiError(
                message,
                code,
                status.value(),
                Instant.now(),
                request.getRequestURI(),
                details
        );

        return ResponseEntity
                .status(status)
                .body(new ApiResult<>(error));
    }
}