package com.portfolio.portfolio_backend.web.dto;

public class AuthResponse {

    private final String accessToken;
    private final String tokenType;
    private final long expiresIn;
    private final String email;

    public AuthResponse(String accessToken, String tokenType, long expiresIn, String email) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.email = email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public String getEmail() {
        return email;
    }
}