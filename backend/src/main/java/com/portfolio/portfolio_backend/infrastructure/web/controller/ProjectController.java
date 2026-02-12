package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.infrastructure.web.dto.ProjectRequestDTO;
import com.portfolio.portfolio_backend.infrastructure.web.dto.ProjectResponseDTO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProjectResponseDTO> getAll() {

        return service.getAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ProjectResponseDTO getById(@PathVariable UUID id) {

        Project project = service.getById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return toResponse(project);
    }

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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
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
