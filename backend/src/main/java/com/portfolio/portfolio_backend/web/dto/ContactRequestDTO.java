package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequestDTO {

    @NotBlank(message = "Name is required - Nom requis")
    @Size(min = 2, max = 80, message = "Name must be between 2 and 80 characters - Nom compris entre 2 et 80 caractères")
    private String name;

    @NotBlank(message = "Email is required - Email requis")
    @Email(message = "Email must be valid - L'Email doit être valide")
    @Size(max = 120, message = "Email is too long - Email trop long")
    private String email;

    @NotBlank(message = "Subject is required - Sujet requis")
    @Size(min = 3, max = 120, message = "Subject must be between 3 and 120 characters - Le sujet doit être compris entre 3 et 120 caractères")
    private String subject;

    @NotBlank(message = "Message is required - Message requis")
    @Size(min = 10, max = 4000, message = "Message must be between 10 and 4000 characters - Le message doit être compris entre 10 et 4000 caractères")
    private String message;

    @Size(max = 200, message = "Invalid field - Champ invalide")
    private String website;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}