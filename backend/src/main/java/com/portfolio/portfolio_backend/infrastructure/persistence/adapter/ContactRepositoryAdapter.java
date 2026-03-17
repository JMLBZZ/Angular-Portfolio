package com.portfolio.portfolio_backend.infrastructure.persistence.adapter;

import com.portfolio.portfolio_backend.domain.model.Contact;
import com.portfolio.portfolio_backend.domain.port.out.ContactRepositoryPort;
import com.portfolio.portfolio_backend.infrastructure.persistence.mapper.ContactMapper;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.JpaContactRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ContactRepositoryAdapter implements ContactRepositoryPort {

    private static final Long SINGLETON_ID = 1L;

    private final JpaContactRepository repository;
    private final ContactMapper mapper;

    public ContactRepositoryAdapter(
            JpaContactRepository repository,
            ContactMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Contact> find() {
        return repository.findById(SINGLETON_ID).map(mapper::toDomain);
    }

    @Override
    public Contact save(Contact contact) {
        return mapper.toDomain(repository.save(mapper.toEntity(contact)));
    }
}