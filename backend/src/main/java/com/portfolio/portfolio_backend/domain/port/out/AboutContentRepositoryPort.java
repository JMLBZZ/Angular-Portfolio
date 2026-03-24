package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.AboutContent;

import java.util.Optional;

public interface AboutContentRepositoryPort {

    Optional<AboutContent> find();

    AboutContent save(AboutContent aboutContent);
}