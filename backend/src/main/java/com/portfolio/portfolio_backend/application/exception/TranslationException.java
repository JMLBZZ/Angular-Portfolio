package com.portfolio.portfolio_backend.application.exception;

public class TranslationException extends RuntimeException {

    public enum Reason {
        CONFIGURATION,
        INVALID_CREDENTIALS,
        QUOTA_EXCEEDED,
        TOO_MANY_REQUESTS,
        TEMPORARY_UNAVAILABLE
    }

    private final Reason reason;

    public TranslationException(Reason reason, String message) {
        super(message);
        this.reason = reason;
    }

    public TranslationException(Reason reason, String message, Throwable cause) {
        super(message, cause);
        this.reason = reason;
    }

    public Reason getReason() {
        return reason;
    }
}