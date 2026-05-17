package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.ContactMessage;
import com.portfolio.portfolio_backend.domain.model.ContactMessageStatus;
import com.portfolio.portfolio_backend.domain.port.out.ContactMessageRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.ContactMessageMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaContactMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class ContactMessageRepositoryAdapter implements ContactMessageRepositoryPort {

    private final JpaContactMessageRepository repository;
    private final ContactMessageMapper mapper;

    public ContactMessageRepositoryAdapter(
            JpaContactMessageRepository repository,
            ContactMessageMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Page<ContactMessage> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDomain);
    }

    @Override
    public Page<ContactMessage> findByStatus(ContactMessageStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable).map(mapper::toDomain);
    }

    @Override
    public Optional<ContactMessage> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public ContactMessage save(ContactMessage message) {
        return mapper.toDomain(repository.save(mapper.toEntity(message)));
    }

    @Override
    public long countAll() {
        return repository.count();
    }

    @Override
    public long countByStatus(ContactMessageStatus status) {
        return repository.countByStatus(status);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}