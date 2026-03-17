package com.portfolio.portfolio_backend.domain.exception;

public class SlugAlreadyUsedException extends RuntimeException {

    public SlugAlreadyUsedException(String message) {
        super(message);
    }
}