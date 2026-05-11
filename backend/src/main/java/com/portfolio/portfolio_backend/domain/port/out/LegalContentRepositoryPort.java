package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.LegalContent;

import java.util.Optional;

public interface LegalContentRepositoryPort {

    Optional<LegalContent> find();

    LegalContent save(LegalContent legalContent);
}