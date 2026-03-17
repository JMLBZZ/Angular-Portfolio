package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContactContentRequestDTO {

    @Valid
    private LocalizedTextDTO title;

    @Valid
    private LocalizedTextDTO subtitle;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    @Size(max = 160, message = "L'email est trop long")
    private String email;

    @Size(max = 80, message = "Le téléphone est trop long")
    private String phone;

    @Size(max = 160, message = "La localisation est trop longue")
    private String location;

    @Pattern(
            regexp = "^(|https?://.+)$",
            message = "Le lien LinkedIn doit commencer par http:// ou https://"
    )
    private String linkedinUrl;

    @Pattern(
            regexp = "^(|https?://.+)$",
            message = "Le lien GitHub doit commencer par http:// ou https://"
    )
    private String githubUrl;

    public ContactContentRequestDTO() {
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LocalizedTextDTO getSubtitle() {
        return subtitle;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }
}