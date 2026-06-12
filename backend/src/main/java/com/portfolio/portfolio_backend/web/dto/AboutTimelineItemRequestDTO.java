package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AboutTimelineItemRequestDTO {

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
    private LongLocalizedTextDTO description;

    @NotBlank(message = "L'icône est obligatoire")
    @Pattern(
            regexp = "^(work|education)$",
            message = "L'icône doit être 'work' ou 'education'"
    )
    private String icon;

    public AboutTimelineItemRequestDTO() {
    }

    public AboutTimelineItemRequestDTO(
            LocalizedTextDTO date,
            LocalizedTextDTO company,
            LocalizedTextDTO title,
            LongLocalizedTextDTO description,
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

    public LongLocalizedTextDTO getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }
}