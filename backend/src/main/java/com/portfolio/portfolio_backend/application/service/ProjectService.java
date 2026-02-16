package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepositoryPort repository;

    public ProjectService(ProjectRepositoryPort repository) {
        this.repository = repository;
    }

    public Project create(Project project) {
        return repository.save(project);
    }

    public Project update(UUID id, Project updatedProject) {

        Project existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Project project = new Project(
                existing.getId(),
                updatedProject.getTitle(),
                updatedProject.getDescription(),
                updatedProject.getGithubUrl(),
                updatedProject.getLiveUrl(),
                existing.getCreatedAt()
        );

        return repository.save(project);
    }
/* 
    public Page<Project> getAll(String search, Pageable pageable) {

        if (search != null && !search.isBlank()) {
            return repository.search(search, pageable);
        }

        return repository.findAll(pageable);
    }
*/
public Page<Project> getAll(
        String search,
        Boolean hasGithub,
        Boolean hasLive,
        LocalDate afterDate,
        Pageable pageable) {

    return repository.searchWithFilters(
            search,
            hasGithub,
            hasLive,
            afterDate,
            pageable
    );
}

    public Optional<Project> getById(UUID id) {
        return repository.findById(id);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
