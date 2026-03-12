package com.portfolio.portfolio_backend.infrastructure.persistence.specification;

import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ProjectEntity;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ProjectSpecification {

    public static Specification<ProjectEntity> hasGithub(Boolean hasGithub) {
        return (root, query, cb) -> {
            if (hasGithub == null) {
                return null;
            }

            if (hasGithub) {
                return cb.and(
                        cb.isNotNull(root.get("githubUrl")),
                        cb.notEqual(root.get("githubUrl"), "")
                );
            }

            return cb.or(
                    cb.isNull(root.get("githubUrl")),
                    cb.equal(root.get("githubUrl"), "")
            );
        };
    }

    public static Specification<ProjectEntity> hasLive(Boolean hasLive) {
        return (root, query, cb) -> {
            if (hasLive == null) {
                return null;
            }

            if (hasLive) {
                return cb.and(
                        cb.isNotNull(root.get("demoUrl")),
                        cb.notEqual(root.get("demoUrl"), "")
                );
            }

            return cb.or(
                    cb.isNull(root.get("demoUrl")),
                    cb.equal(root.get("demoUrl"), "")
            );
        };
    }

    public static Specification<ProjectEntity> createdAfter(LocalDate date) {
        return (root, query, cb) -> {
            if (date == null) {
                return null;
            }

            return cb.greaterThanOrEqualTo(root.get("createdAt"), date);
        };
    }

    public static Specification<ProjectEntity> containsText(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return null;
            }

            String pattern = "%" + search.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("slug")), pattern),
                    cb.like(cb.lower(root.get("descriptionFr")), pattern),
                    cb.like(cb.lower(root.get("descriptionEn")), pattern),
                    cb.like(cb.lower(root.get("longDescriptionFr")), pattern),
                    cb.like(cb.lower(root.get("longDescriptionEn")), pattern)
            );
        };
    }
}