package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.web.dto.ProjectRequestDTO;
import com.portfolio.portfolio_backend.infrastructure.web.dto.ProjectResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projects")
@Tag(name = "Projects", description = "Gestion des projets du portfolio")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @Operation(summary = "Récupérer tous les projets")
    @ApiResponse(responseCode = "200", description = "Liste des projets récupérée")
    @GetMapping
    public List<ProjectResponseDTO> getAll() {

        return service.getAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Récupérer un projet par ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projet trouvé"),
            @ApiResponse(responseCode = "404", description = "Projet non trouvé")
    })
    @GetMapping("/{id}")
    public ProjectResponseDTO getById(
            @Parameter(description = "UUID du projet")
            @PathVariable UUID id
    ) {

        Project project = service.getById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return toResponse(project);
    }

    @Operation(summary = "Créer un nouveau projet")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projet créé"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping
    public ProjectResponseDTO create(
            @Valid @RequestBody ProjectRequestDTO dto
    ) {

        Project project = new Project(
                UUID.randomUUID(),
                dto.getTitle(),
                dto.getDescription(),
                dto.getGithubUrl(),
                dto.getLiveUrl(),
                LocalDate.now()
        );

        return toResponse(service.create(project));
    }

    @Operation(summary = "Supprimer un projet")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projet supprimé"),
            @ApiResponse(responseCode = "404", description = "Projet non trouvé")
    })
    @DeleteMapping("/{id}")
    public void delete(
            @Parameter(description = "UUID du projet à supprimer")
            @PathVariable UUID id
    ) {
        service.delete(id);
    }

    private ProjectResponseDTO toResponse(Project project) {

        return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.getCreatedAt()
        );
    }
}
