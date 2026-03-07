package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ContactService;
import com.portfolio.portfolio_backend.web.dto.ContactRequestDTO;
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
    public ApiResult<String> send(
            @Valid @RequestBody ContactRequestDTO dto,
            HttpServletRequest request
    ) {
        String clientIp = extractClientIp(request);

        contactService.send(dto, clientIp);

        return new ApiResult<>(true, "OK", null);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");

        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}