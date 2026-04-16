package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.portfolio.portfolio_backend.domain.exception.SlugAlreadyUsedException;
import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Transactional
    public Project create(Project project) {
        ensureSlugAvailable(project.getSlug(), null);

        int nextDisplayOrder = repository.findMaxDisplayOrder()
                .map(max -> max + 1)
                .orElse(0);

        Project projectToSave = new Project(
                project.getId(),
                project.getSlug(),
                project.getTitle(),
                project.getCategory(),
                project.getImage(),
                project.getCover(),
                project.getImages(),
                project.getDescription(),
                project.getLongDescription(),
                project.getStack(),
                project.getType(),
                project.isFeatured(),
                project.getRole(),
                project.getProblem(),
                project.getSolution(),
                project.getDemoUrl(),
                project.getTags(),
                project.getGithubUrl(),
                project.isShowGithub(),
                project.isPublished(),
                nextDisplayOrder,
                project.getCreatedAt()
        );

        return repository.save(projectToSave);
    }

    @Transactional
    public Project update(UUID id, Project updatedProject) {
        Project existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ensureSlugAvailable(updatedProject.getSlug(), existing.getId());

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
                existing.getDisplayOrder(),
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

    @Transactional
    public void delete(UUID id) {
        Project existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        LinkedHashSet<String> imageUrlsToDelete = collectProjectImageUrls(existing);

        repository.deleteById(id);

        for (String imageUrl : imageUrlsToDelete) {
            projectImageStorageService.delete(imageUrl);
        }
    }

    @Transactional
    public List<Project> reorderProjects(List<UUID> orderedProjectIds) {
        List<Project> existingProjects = repository.findAllOrdered();

        if (orderedProjectIds == null || orderedProjectIds.isEmpty()) {
            throw new IllegalArgumentException("La liste des projets à réordonner est obligatoire.");
        }

        if (orderedProjectIds.size() != existingProjects.size()) {
            throw new IllegalArgumentException("La liste reçue doit contenir tous les projets.");
        }

        LinkedHashSet<UUID> distinctIds = new LinkedHashSet<>(orderedProjectIds);

        if (distinctIds.size() != orderedProjectIds.size()) {
            throw new IllegalArgumentException("La liste reçue contient des doublons.");
        }

        LinkedHashSet<UUID> existingIds = existingProjects.stream()
                .map(Project::getId)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (!existingIds.equals(distinctIds)) {
            throw new IllegalArgumentException("La liste reçue ne correspond pas exactement aux projets existants.");
        }

        List<Project> reorderedProjects = orderedProjectIds.stream()
                .map(projectId -> existingProjects.stream()
                        .filter(project -> project.getId().equals(projectId))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Project not found")))
                .toList();

        int highestDisplayOrder = reorderedProjects.size() - 1;
        int temporaryOffset = highestDisplayOrder + 1000;

        List<Project> temporaryProjectsToSave = reorderedProjects.stream()
                .map(project -> {
                    int index = reorderedProjects.indexOf(project);
                    int temporaryDisplayOrder = temporaryOffset + (highestDisplayOrder - index);

                    return new Project(
                            project.getId(),
                            project.getSlug(),
                            project.getTitle(),
                            project.getCategory(),
                            project.getImage(),
                            project.getCover(),
                            project.getImages(),
                            project.getDescription(),
                            project.getLongDescription(),
                            project.getStack(),
                            project.getType(),
                            project.isFeatured(),
                            project.getRole(),
                            project.getProblem(),
                            project.getSolution(),
                            project.getDemoUrl(),
                            project.getTags(),
                            project.getGithubUrl(),
                            project.isShowGithub(),
                            project.isPublished(),
                            temporaryDisplayOrder,
                            project.getCreatedAt()
                    );
                })
                .toList();

        repository.saveAllAndFlush(temporaryProjectsToSave);

        List<Project> finalProjectsToSave = reorderedProjects.stream()
                .map(project -> {
                    int index = reorderedProjects.indexOf(project);
                    int newDisplayOrder = highestDisplayOrder - index;

                    return new Project(
                            project.getId(),
                            project.getSlug(),
                            project.getTitle(),
                            project.getCategory(),
                            project.getImage(),
                            project.getCover(),
                            project.getImages(),
                            project.getDescription(),
                            project.getLongDescription(),
                            project.getStack(),
                            project.getType(),
                            project.isFeatured(),
                            project.getRole(),
                            project.getProblem(),
                            project.getSolution(),
                            project.getDemoUrl(),
                            project.getTags(),
                            project.getGithubUrl(),
                            project.isShowGithub(),
                            project.isPublished(),
                            newDisplayOrder,
                            project.getCreatedAt()
                    );
                })
                .toList();

        return repository.saveAllAndFlush(finalProjectsToSave).stream()
                .sorted((a, b) -> {
                    int compareOrder = Integer.compare(
                            b.getDisplayOrder() != null ? b.getDisplayOrder() : 0,
                            a.getDisplayOrder() != null ? a.getDisplayOrder() : 0
                    );

                    if (compareOrder != 0) {
                        return compareOrder;
                    }

                    LocalDate createdAtA = a.getCreatedAt();
                    LocalDate createdAtB = b.getCreatedAt();

                    if (createdAtA == null && createdAtB == null) {
                        return 0;
                    }

                    if (createdAtA == null) {
                        return 1;
                    }

                    if (createdAtB == null) {
                        return -1;
                    }

                    return createdAtB.compareTo(createdAtA);
                })
                .toList();
    }

    private void ensureSlugAvailable(String slug, UUID currentProjectId) {
        if (slug == null || slug.isBlank()) {
            return;
        }

        repository.findBySlug(slug.trim())
                .ifPresent(project -> {
                    boolean sameProject = currentProjectId != null && currentProjectId.equals(project.getId());

                    if (!sameProject) {
                        throw new SlugAlreadyUsedException("Ce slug est déjà utilisé par un autre projet.");
                    }
                });
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