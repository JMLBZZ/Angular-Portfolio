package com.portfolio.portfolio_backend.domain.port.out;

import com.portfolio.portfolio_backend.domain.model.ResumeContent;

import java.util.Optional;

public interface ResumeContentRepositoryPort {

    Optional<ResumeContent> find();

    ResumeContent save(ResumeContent resumeContent);
}