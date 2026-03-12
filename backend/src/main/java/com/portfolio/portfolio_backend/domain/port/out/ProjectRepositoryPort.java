package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepositoryPort {

    Project save(Project project);

    Optional<Project> findById(UUID id);

    Optional<Project> findBySlug(String slug);

    Page<Project> findAll(Pageable pageable);

    Page<Project> search(String search, Pageable pageable);

    Page<Project> searchWithFilters(
            String search,
            Boolean hasGithub,
            Boolean hasLive,
            LocalDate afterDate,
            Pageable pageable
    );

    List<Project> findPublishedOrdered();

    Optional<Project> findPublishedBySlug(String slug);

    void deleteById(UUID id);
}