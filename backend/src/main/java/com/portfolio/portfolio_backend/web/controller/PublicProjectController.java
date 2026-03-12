package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import com.portfolio.portfolio_backend.web.dto.ProjectResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/projects")
@Tag(name = "Public Projects", description = "Consultation publique des projets")
public class PublicProjectController {

    private final ProjectService service;

    public PublicProjectController(ProjectService service) {
        this.service = service;
    }

    @Operation(summary = "Lister les projets publiés")
    @GetMapping
    public List<ProjectResponseDTO> getPublishedProjects() {
        return service.getPublishedProjects()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Récupérer un projet publié par slug")
    @GetMapping("/{slug}")
    public ProjectResponseDTO getPublishedProjectBySlug(@PathVariable String slug) {
        Project project = service.getPublishedProjectBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return toResponse(project);
    }

    private ProjectResponseDTO toResponse(Project project) {
        return new ProjectResponseDTO(
                project.getId(),
                project.getSlug(),
                project.getTitle(),
                project.getCategory(),
                project.getImage(),
                project.getCover(),
                project.getImages(),
                toDtoLocalized(project.getDescription()),
                toDtoLocalized(project.getLongDescription()),
                project.getStack(),
                project.getType(),
                project.isFeatured(),
                toDtoLocalized(project.getRole()),
                toDtoLocalized(project.getProblem()),
                toDtoLocalized(project.getSolution()),
                project.getDemoUrl(),
                project.getTags(),
                project.getGithubUrl(),
                project.isShowGithub(),
                project.isPublished(),
                project.getDisplayOrder(),
                project.getCreatedAt()
        );
    }

    private LocalizedTextDTO toDtoLocalized(LocalizedText text) {
        if (text == null) {
            return null;
        }
        return new LocalizedTextDTO(text.getFr(), text.getEn());
    }
}