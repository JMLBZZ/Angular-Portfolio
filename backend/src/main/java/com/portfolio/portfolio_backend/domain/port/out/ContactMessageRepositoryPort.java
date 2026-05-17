package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface ContactMessageRepositoryPort {

    Page<ContactMessage> findAll(Pageable pageable);

    Page<ContactMessage> findByStatus(ContactMessageStatus status, Pageable pageable);

    Optional<ContactMessage> findById(UUID id);

    ContactMessage save(ContactMessage message);

    long countAll();

    long countByStatus(ContactMessageStatus status);

    void deleteById(UUID id);
}