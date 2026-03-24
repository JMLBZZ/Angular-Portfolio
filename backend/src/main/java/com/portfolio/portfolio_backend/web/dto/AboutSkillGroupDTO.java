package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.Valid;

import java.util.List;

public class AboutSkillGroupDTO {

    @Valid
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