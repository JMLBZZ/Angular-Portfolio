package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.Contact;

import java.util.Optional;

public interface ContactRepositoryPort {

    Optional<Contact> find();

    Contact save(Contact contact);
}