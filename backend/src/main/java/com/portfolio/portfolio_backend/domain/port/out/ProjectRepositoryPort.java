package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.Project;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectRepositoryPort {

    Page<Project> findAll(Pageable pageable);
    Page<Project> search(String search, Pageable pageable);
    Page<Project> searchWithFilters(
        String search,
        Boolean hasGithub,
        Boolean hasLive,
        LocalDate afterDate,
        Pageable pageable);

    Optional<Project> findById(UUID id);

    Project save(Project project);

    void deleteById(UUID id);
}
