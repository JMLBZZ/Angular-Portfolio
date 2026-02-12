package com.portfolio.portfolio_backend.infrastructure.web.controller;

import com.portfolio.portfolio_backend.application.service.ProjectService;
import com.portfolio.portfolio_backend.domain.model.Project;
import org.springframework.web.bind.annotation.*;

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
    public List<Project> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable UUID id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Project not found - Projet non trouvé"));
    }

    @PostMapping
    public Project create(@RequestBody Project project) {

        Project newProject = new Project(
                UUID.randomUUID(),
                project.getTitle(),
                project.getDescription(),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.getCreatedAt()
        );

        return service.create(newProject);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
