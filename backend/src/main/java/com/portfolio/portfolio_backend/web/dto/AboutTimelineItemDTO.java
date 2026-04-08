package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AboutTimelineItemDTO {

    @Valid
    @NotNull(message = "La date est obligatoire")
    private LocalizedTextDTO date;

    @Valid
    @NotNull(message = "L'entreprise ou l'école est obligatoire")
    private LocalizedTextDTO company;

    @Valid
    @NotNull(message = "Le titre est obligatoire")
    private LocalizedTextDTO title;

    @Valid
    @NotNull(message = "La description est obligatoire")
    private LocalizedTextDTO description;

    @NotBlank(message = "L'icône est obligatoire")
    @Pattern(
            regexp = "^(work|education)$",
            message = "L'icône doit être 'work' ou 'education'"
    )
    private String icon;

    public AboutTimelineItemDTO() {
    }

    public AboutTimelineItemDTO(
            LocalizedTextDTO date,
            LocalizedTextDTO company,
            LocalizedTextDTO title,
            LocalizedTextDTO description,
            String icon
    ) {
        this.date = date;
        this.company = company;
        this.title = title;
        this.description = description;
        this.icon = icon;
    }

    public LocalizedTextDTO getDate() {
        return date;
    }

    public LocalizedTextDTO getCompany() {
        return company;
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public LocalizedTextDTO getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }
}