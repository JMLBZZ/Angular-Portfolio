package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ContactService;
import com.portfolio.portfolio_backend.web.dto.ContactRequestDTO;
import com.portfolio.portfolio_backend.web.response.ApiError;
import com.portfolio.portfolio_backend.web.response.ApiResult;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.OK)
    public ApiResult<?> send(@Valid @RequestBody ContactRequestDTO dto, HttpServletRequest request) {

        String ip = extractClientIp(request);

        try {
            contactService.send(dto, ip);
            return new ApiResult<>(true, "OK", null);
        } catch (IllegalArgumentException ex) {
            if ("SPAM_DETECTED".equals(ex.getMessage())) {
                return new ApiResult<>(new ApiError("Spam detected", "SPAM_DETECTED"));
            }
            return new ApiResult<>(new ApiError("Bad request", "BAD_REQUEST"));
        } catch (IllegalStateException ex) {
            if ("RATE_LIMIT".equals(ex.getMessage())) {
                return new ApiResult<>(new ApiError("Too many requests", "RATE_LIMIT"));
            }
            return new ApiResult<>(new ApiError("Error", "ERROR"));
        }
    }

    private String extractClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}