package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContactRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 80, message = "Name must be between 2 and 80 characters")
    @Pattern(
        regexp = "^[\\p{L} .'-]+$",
        message = "Name contains invalid characters"
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 120, message = "Email is too long")
    private String email;

    @NotBlank(message = "Subject is required")
    @Size(min = 3, max = 120, message = "Subject must be between 3 and 120 characters")
    @Pattern(
        regexp = "^(?=.*[\\p{L}\\p{N}]).+$",
        message = "Subject must contain meaningful characters"
    )
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 4000, message = "Message must be between 10 and 4000 characters")
    @Pattern(
        regexp = "^(?=.*[\\p{L}\\p{N}]).+$",
        message = "Message must contain meaningful characters"
    )
    private String message;

    /**
     * Honeypot anti-spam.
     * Ce champ doit rester vide côté utilisateur normal.
     */
    @Size(max = 200, message = "Invalid field")
    private String website;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
}