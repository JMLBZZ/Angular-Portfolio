package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaProjectRepository extends JpaRepository<ProjectEntity, UUID>, JpaSpecificationExecutor<ProjectEntity> {

    Optional<ProjectEntity> findBySlug(String slug);

    Optional<ProjectEntity> findBySlugAndPublishedTrue(String slug);

    List<ProjectEntity> findAllByOrderByDisplayOrderDescCreatedAtDesc();

    List<ProjectEntity> findByPublishedTrueOrderByDisplayOrderDescCreatedAtDesc();

    Optional<ProjectEntity> findTopByOrderByDisplayOrderDesc();

    @Query("select max(p.displayOrder) from ProjectEntity p")
    Optional<Integer> findMaxDisplayOrder();
}