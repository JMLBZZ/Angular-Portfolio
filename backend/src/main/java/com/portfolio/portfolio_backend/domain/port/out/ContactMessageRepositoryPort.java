package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactMessageRepositoryPort {

    Page<ContactMessage> findAll(Pageable pageable);

    Page<ContactMessage> findByStatus(ContactMessageStatus status, Pageable pageable);

    Page<ContactMessage> search(ContactMessageStatus status, String query, Pageable pageable);

    Optional<ContactMessage> findById(UUID id);

    List<ContactMessage> findAllByIds(List<UUID> ids);

    ContactMessage save(ContactMessage message);

    List<ContactMessage> saveAll(List<ContactMessage> messages);

    long countAll();

    long countByStatus(ContactMessageStatus status);

    void deleteById(UUID id);

    void deleteAllByIds(List<UUID> ids);
}