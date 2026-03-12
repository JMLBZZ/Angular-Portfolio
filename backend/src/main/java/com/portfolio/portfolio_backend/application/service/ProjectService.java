package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
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
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Project project = new Project(
                existing.getId(),
                updatedProject.getSlug(),
                updatedProject.getTitle(),
                updatedProject.getCategory(),
                updatedProject.getImage(),
                updatedProject.getCover(),
                updatedProject.getImages(),
                updatedProject.getDescription(),
                updatedProject.getLongDescription(),
                updatedProject.getStack(),
                updatedProject.getType(),
                updatedProject.isFeatured(),
                updatedProject.getRole(),
                updatedProject.getProblem(),
                updatedProject.getSolution(),
                updatedProject.getDemoUrl(),
                updatedProject.getTags(),
                updatedProject.getGithubUrl(),
                updatedProject.isShowGithub(),
                updatedProject.isPublished(),
                updatedProject.getDisplayOrder(),
                existing.getCreatedAt()
        );

        return repository.save(project);
    }

    public Page<Project> getAll(
            String search,
            Boolean hasGithub,
            Boolean hasLive,
            LocalDate afterDate,
            Pageable pageable
    ) {
        return repository.searchWithFilters(search, hasGithub, hasLive, afterDate, pageable);
    }

    public Optional<Project> getById(UUID id) {
        return repository.findById(id);
    }

    public Optional<Project> getBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    public List<Project> getPublishedProjects() {
        return repository.findPublishedOrdered();
    }

    public Optional<Project> getPublishedProjectBySlug(String slug) {
        return repository.findPublishedBySlug(slug);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}