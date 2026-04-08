package com.portfolio.portfolio_backend.web.response;

import java.time.Instant;
import java.util.Map;

public class ApiError {

    private String message;
    private String code;
    private Integer status;
    private Instant timestamp;
    private String path;
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

    public ApiError(
            String message,
            String code,
            Integer status,
            Instant timestamp,
            String path,
            Map<String, String> details
    ) {
        this.message = message;
        this.code = code;
        this.status = status;
        this.timestamp = timestamp;
        this.path = path;
        this.details = details;
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }

    public Integer getStatus() {
        return status;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public String getPath() {
        return path;
    }

    public Map<String, String> getDetails() {
        return details;
    }
}