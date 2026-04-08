package com.portfolio.portfolio_backend.infrastructure.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final SecurityApiErrorWriter securityApiErrorWriter;

    public RestAccessDeniedHandler(SecurityApiErrorWriter securityApiErrorWriter) {
        this.securityApiErrorWriter = securityApiErrorWriter;
    }

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {
        securityApiErrorWriter.write(
                request,
                response,
                HttpStatus.FORBIDDEN,
                "Accès refusé.",
                "FORBIDDEN"
        );
    }
}