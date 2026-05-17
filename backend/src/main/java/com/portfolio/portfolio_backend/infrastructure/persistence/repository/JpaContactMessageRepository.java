package com.portfolio.portfolio_backend.infrastructure.persistence.repository;

import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.ContactMessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaContactMessageRepository extends JpaRepository<ContactMessageEntity, UUID> {

    Page<ContactMessageEntity> findByStatus(ContactMessageStatus status, Pageable pageable);

    long countByStatus(ContactMessageStatus status);
}