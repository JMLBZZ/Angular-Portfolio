package com.portfolio.portfolio_backend.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.LocalizedText;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.web.dto.LocalizedTextDTO;
import com.portfolio.portfolio_backend.web.dto.ProjectRequestDTO;
import com.portfolio.portfolio_backend.web.dto.ProjectResponseDTO;
import com.portfolio.portfolio_backend.web.response.ApiResult;
import com.portfolio.portfolio_backend.web.response.PageMetadata;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Projects", description = "Gestion admin des projets du portfolio")
public class AdminProjectController {

    private final ProjectService service;

    public AdminProjectController(ProjectService service) {
        this.service = service;
    }

    @Operation(summary = "Récupérer tous les projets pour l'administration")
    @GetMapping
    public ApiResult<List<ProjectResponseDTO>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean hasGithub,
            @RequestParam(required = false) Boolean hasLive,
            @RequestParam(required = false) LocalDate afterDate,
            @ParameterObject
            @PageableDefault(page = 0, size = 20, sort = "displayOrder", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<ProjectResponseDTO> pageResult = service
                .getAll(search, hasGithub, hasLive, afterDate, pageable)
                .map(this::toResponse);

        PageMetadata meta = new PageMetadata(
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );

        return new ApiResult<>(true, pageResult.getContent(), meta);
    }

    @Operation(summary = "Récupérer un projet admin par ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Projet trouvé"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Projet non trouvé")
    })
    @GetMapping("/{id}")
    public ProjectResponseDTO getById(@Parameter(description = "UUID du projet") @PathVariable UUID id) {
        Project project = service.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return toResponse(project);
    }

    @Operation(summary = "Créer un projet")
    @PostMapping
    public ProjectResponseDTO create(@Valid @RequestBody ProjectRequestDTO dto) {
        Project project = toDomain(dto, UUID.randomUUID(), LocalDate.now());
        return toResponse(service.create(project));
    }

    @Operation(summary = "Modifier un projet")
    @PutMapping("/{id}")
    public ProjectResponseDTO update(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequestDTO dto
    ) {
        Project project = toDomain(dto, id, LocalDate.now());
        return toResponse(service.update(id, project));
    }

    @Operation(summary = "Supprimer un projet")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    private Project toDomain(ProjectRequestDTO dto, UUID id, LocalDate createdAt) {
        return new Project(
                id,
                dto.getSlug(),
                dto.getTitle(),
                dto.getCategory(),
                dto.getImage(),
                dto.getCover(),
                dto.getImages(),
                toDomainLocalized(dto.getDescription()),
                toDomainLocalized(dto.getLongDescription()),
                dto.getStack(),
                dto.getType(),
                Boolean.TRUE.equals(dto.getFeatured()),
                toDomainLocalized(dto.getRole()),
                toDomainLocalized(dto.getProblem()),
                toDomainLocalized(dto.getSolution()),
                dto.getDemoUrl(),
                dto.getTags(),
                dto.getGithubUrl(),
                Boolean.TRUE.equals(dto.getShowGithub()),
                dto.getPublished() == null || dto.getPublished(),
                dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0,
                createdAt
        );
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

    private LocalizedText toDomainLocalized(LocalizedTextDTO dto) {
        if (dto == null) {
            return null;
        }
        return new LocalizedText(dto.getFr(), dto.getEn());
    }

    private LocalizedTextDTO toDtoLocalized(LocalizedText text) {
        if (text == null) {
            return null;
        }
        return new LocalizedTextDTO(text.getFr(), text.getEn());
    }
}