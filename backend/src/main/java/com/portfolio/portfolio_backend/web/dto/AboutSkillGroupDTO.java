package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class AboutSkillGroupDTO {

    @Valid
    @NotNull(message = "Le titre du groupe de compétences est obligatoire")
    private LocalizedTextDTO title;

    @Valid
    private List<AboutSkillItemDTO> items;

    public AboutSkillGroupDTO() {
    }

    public AboutSkillGroupDTO(LocalizedTextDTO title, List<AboutSkillItemDTO> items) {
        this.title = title;
        this.items = items;
    }

    public LocalizedTextDTO getTitle() {
        return title;
    }

    public List<AboutSkillItemDTO> getItems() {
        return items;
    }
}