package com.portfolio.portfolio_backend.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AboutSkillItemDTO {

    @NotBlank(message = "Le nom de compétence est obligatoire")
    @Size(max = 80, message = "Le nom de compétence est trop long")
    private String name;

    @Min(value = 0, message = "La valeur doit être supérieure ou égale à 0")
    @Max(value = 100, message = "La valeur doit être inférieure ou égale à 100")
    private int value;

    public AboutSkillItemDTO() {
    }

    public AboutSkillItemDTO(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }
}