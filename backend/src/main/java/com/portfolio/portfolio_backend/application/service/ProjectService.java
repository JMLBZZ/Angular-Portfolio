package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepositoryPort repository;
    private final ProjectImageStorageService projectImageStorageService;

    public ProjectService(
            ProjectRepositoryPort repository,
            ProjectImageStorageService projectImageStorageService
    ) {
        this.repository = repository;
        this.projectImageStorageService = projectImageStorageService;
    }

    public Project create(Project project) {
        return repository.save(project);
    }

    public Project update(UUID id, Project updatedProject) {
        Project existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        LinkedHashSet<String> existingImageUrls = collectProjectImageUrls(existing);
        LinkedHashSet<String> updatedImageUrls = collectProjectImageUrls(updatedProject);

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

        Project savedProject = repository.save(project);

        for (String existingImageUrl : existingImageUrls) {
            if (!updatedImageUrls.contains(existingImageUrl)) {
                projectImageStorageService.delete(existingImageUrl);
            }
        }

        return savedProject;
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
        Project existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        LinkedHashSet<String> imageUrlsToDelete = collectProjectImageUrls(existing);

        repository.deleteById(id);

        for (String imageUrl : imageUrlsToDelete) {
            projectImageStorageService.delete(imageUrl);
        }
    }

    private LinkedHashSet<String> collectProjectImageUrls(Project project) {
        LinkedHashSet<String> imageUrls = new LinkedHashSet<>();

        addIfPresent(imageUrls, project.getImage());
        addIfPresent(imageUrls, project.getCover());

        if (project.getImages() != null) {
            for (String imageUrl : project.getImages()) {
                addIfPresent(imageUrls, imageUrl);
            }
        }

        return imageUrls;
    }

    private void addIfPresent(LinkedHashSet<String> values, String value) {
        if (value != null && !value.isBlank()) {
            values.add(value);
        }
    }
}