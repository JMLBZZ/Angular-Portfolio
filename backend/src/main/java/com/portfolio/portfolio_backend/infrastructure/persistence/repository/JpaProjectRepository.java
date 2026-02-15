package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface JpaProjectRepository extends JpaRepository<ProjectEntity, UUID>, JpaSpecificationExecutor<ProjectEntity> {
    //Cherche dans le titre, ou la description et ignore la casse :
    Page<ProjectEntity> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String title,
        String description,
        Pageable pageable
    );

}
