package com.portfolio.portfolio_backend.web.response;

import java.util.Map;

public class ApiError {

    private String message;
    private String code;
    private Map<String, String> details;

    public ApiError(String message, String code) {
        this.message = message;
        this.code = code;
    }

    public ApiError(String message, String code, Map<String, String> details) {
        this.message = message;
        this.code = code;
        this.details = details;
    }

    public String getMessage() { return message; }
    public String getCode() { return code; }
    public Map<String, String> getDetails() { return details; }
}
