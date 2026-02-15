package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.out.ProjectRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.ProjectMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaProjectRepository;
import com.portfolio.portfolio_backend.infrastructure.persistence.specification.ProjectSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ProjectRepositoryAdapter implements ProjectRepositoryPort {

    private final JpaProjectRepository repository;
    private final ProjectMapper mapper;

    public ProjectRepositoryAdapter(
            JpaProjectRepository repository,
            ProjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Project save(Project project) {

        ProjectEntity entity = mapper.toEntity(project);
        ProjectEntity saved = repository.save(entity);

        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Project> findById(UUID id) {

        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Page<Project> findAll(Pageable pageable) {

        return repository.findAll(pageable)
                .map(mapper::toDomain);
    }

    @Override
    public Page<Project> search(String search, Pageable pageable) {

        return repository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        search,
                        search,
                        pageable)
                .map(mapper::toDomain);
    }

    @Override
    public Page<Project> searchWithFilters(
            String search,
            Boolean hasGithub,
            Boolean hasLive,
            LocalDate afterDate,
            Pageable pageable) {

        Specification<ProjectEntity> spec = Specification
                .where(ProjectSpecification.containsText(search))
                .and(ProjectSpecification.hasGithub(hasGithub))
                .and(ProjectSpecification.hasLive(hasLive))
                .and(ProjectSpecification.createdAfter(afterDate));

        return repository.findAll(spec, pageable)
                .map(mapper::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
