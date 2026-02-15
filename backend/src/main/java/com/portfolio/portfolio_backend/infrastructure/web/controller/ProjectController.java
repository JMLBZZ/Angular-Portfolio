package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.web.dto.ProjectRequestDTO;
import com.portfolio.portfolio_backend.infrastructure.web.dto.ProjectResponseDTO;
import com.portfolio.portfolio_backend.infrastructure.web.response.ApiResponse;
import com.portfolio.portfolio_backend.infrastructure.web.response.PageMetadata;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Liste des projets récupérée")
        /*
         * @GetMapping
         * public Page<ProjectResponseDTO> getAll(
         * 
         * @RequestParam(required = false) String search,
         * 
         * @RequestParam(required = false) Boolean hasGithub,
         * 
         * @RequestParam(required = false) Boolean hasLive,
         * 
         * @RequestParam(required = false) LocalDate afterDate,
         * 
         * @PageableDefault(page = 0, size = 10, sort = "createdAt", direction =
         * Sort.Direction.DESC) Pageable pageable) {
         * 
         * return service.getAll(
         * search,
         * hasGithub,
         * hasLive,
         * afterDate,
         * pageable).map(this::toResponse);
         * }
         */
        @GetMapping
        public ApiResponse<List<ProjectResponseDTO>> getAll(
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) Boolean hasGithub,
                        @RequestParam(required = false) Boolean hasLive,
                        @RequestParam(required = false) LocalDate afterDate,
                        @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

                Page<ProjectResponseDTO> pageResult = service
                                .getAll(search, hasGithub, hasLive, afterDate, pageable)
                                .map(this::toResponse);

                PageMetadata meta = new PageMetadata(
                                pageResult.getNumber(),
                                pageResult.getSize(),
                                pageResult.getTotalElements(),
                                pageResult.getTotalPages());

                return new ApiResponse<>(
                                true,
                                pageResult.getContent(),
                                meta);
        }

        @Operation(summary = "Récupérer un projet par ID")
        @ApiResponses({
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Projet trouvé"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Projet non trouvé")
        })
        @GetMapping("/{id}")
        public ProjectResponseDTO getById(
                        @Parameter(description = "UUID du projet") @PathVariable UUID id) {

                Project project = service.getById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

                return toResponse(project);
        }

        @Operation(summary = "Créer un nouveau projet")
        @ApiResponses({
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Projet créé"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Données invalides")
        })
        @PostMapping
        public ProjectResponseDTO create(
                        @Valid @RequestBody ProjectRequestDTO dto) {

                Project project = new Project(
                                UUID.randomUUID(),
                                dto.getTitle(),
                                dto.getDescription(),
                                dto.getGithubUrl(),
                                dto.getLiveUrl(),
                                LocalDate.now());

                return toResponse(service.create(project));
        }

        @Operation(summary = "Supprimer un projet")
        @ApiResponses({
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Projet supprimé"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Projet non trouvé")
        })
        @DeleteMapping("/{id}")
        public void delete(
                        @Parameter(description = "UUID du projet à supprimer") @PathVariable UUID id) {
                service.delete(id);
        }

        @Operation(summary = "Modifier un projet par ID")
        @ApiResponses({
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Projet modifié"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Projet non trouvé")
        })
        @PutMapping("/{id}")
        public ProjectResponseDTO update(
                        @PathVariable UUID id,
                        @Valid @RequestBody ProjectRequestDTO dto) {

                Project project = new Project(
                                id,
                                dto.getTitle(),
                                dto.getDescription(),
                                dto.getGithubUrl(),
                                dto.getLiveUrl(),
                                LocalDate.now() // ignoré par le service
                );

                return toResponse(service.update(id, project));
        }

        private ProjectResponseDTO toResponse(Project project) {

                return new ProjectResponseDTO(
                                project.getId(),
                                project.getTitle(),
                                project.getDescription(),
                                project.getGithubUrl(),
                                project.getLiveUrl(),
                                project.getCreatedAt());
        }
}
