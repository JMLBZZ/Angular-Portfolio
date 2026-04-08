package com.portfolio.portfolio_backend.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.portfolio_backend.web.response.ApiError;
import com.portfolio.portfolio_backend.web.response.ApiResult;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

@Component
public class SecurityApiErrorWriter {

    private final ObjectMapper objectMapper;

    public SecurityApiErrorWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void write(
            HttpServletRequest request,
            HttpServletResponse response,
            HttpStatus status,
            String message,
            String code
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ApiError error = new ApiError(
                message,
                code,
                status.value(),
                Instant.now(),
                request.getRequestURI(),
                null
        );

        objectMapper.writeValue(response.getOutputStream(), new ApiResult<>(error));
    }
}