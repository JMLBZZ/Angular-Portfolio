package com.portfolio.portfolio_backend.web.dto;

public class LoginRequest {

    private String email;
    private String password;

    public LoginRequest() {}

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
