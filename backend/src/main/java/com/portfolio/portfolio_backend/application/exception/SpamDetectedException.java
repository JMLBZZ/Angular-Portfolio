package com.portfolio.portfolio_backend.application.exception;

public class SpamDetectedException extends RuntimeException {

    public SpamDetectedException(String message) {
        super(message);
    }
}