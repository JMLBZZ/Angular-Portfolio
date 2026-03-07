package com.portfolio.portfolio_backend.web.exception;

import com.portfolio.portfolio_backend.application.exception.RateLimitException;
import com.portfolio.portfolio_backend.application.exception.SpamDetectedException;
import com.portfolio.portfolio_backend.domain.exception.EmailAlreadyUsedException;
import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.web.response.ApiError;
import com.portfolio.portfolio_backend.web.response.ApiResult;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Gestion des ressources non trouvées (404)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResult<?> handleNotFound(ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        return new ApiResult<>(
                new ApiError(ex.getMessage(), "NOT_FOUND")
        );
    }

    /**
     * Gestion des erreurs de validation (400)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResult<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        logger.warn("Validation failed: {}", errors);

        return new ApiResult<>(
                new ApiError(
                        "Validation failed",
                        "VALIDATION_ERROR",
                        errors
                )
        );
    }

    /**
     * Gestion de conflit des emails déjà utilisés (409)
     */
    @ExceptionHandler(EmailAlreadyUsedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResult<?> handleEmailAlreadyUsed(EmailAlreadyUsedException ex) {
        logger.warn("Email already used: {}", ex.getMessage());

        return new ApiResult<>(
                new ApiError(ex.getMessage(), "EMAIL_ALREADY_USED")
        );
    }

    /**
     * Gestion du spam détecté (400)
     */
    @ExceptionHandler(SpamDetectedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResult<?> handleSpamDetected(SpamDetectedException ex) {
        logger.warn("Spam detected: {}", ex.getMessage());

        return new ApiResult<>(
                new ApiError(ex.getMessage(), "SPAM_DETECTED")
        );
    }

    /**
     * Gestion du rate limit (429)
     */
    @ExceptionHandler(RateLimitException.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public ApiResult<?> handleRateLimit(RateLimitException ex) {
        logger.warn("Rate limit triggered: {}", ex.getMessage());

        return new ApiResult<>(
                new ApiError(ex.getMessage(), "RATE_LIMIT")
        );
    }

    /**
     * Gestion des erreurs SMTP / email (500)
     */
    @ExceptionHandler(MailException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResult<?> handleMailException(MailException ex) {
        logger.error("Mail sending failed", ex);

        return new ApiResult<>(
                new ApiError("Email sending failed", "SMTP_ERROR")
        );
    }

    /**
     * Gestion générique des erreurs backend (500)
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResult<?> handleGenericException(Exception ex) {
        logger.error("Unexpected backend error", ex);

        return new ApiResult<>(
                new ApiError("Internal server error", "INTERNAL_ERROR")
        );
    }
}