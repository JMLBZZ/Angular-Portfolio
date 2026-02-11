package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Project;
import com.portfolio.portfolio_backend.domain.port.ProjectRepository;
import java.util.List;

public class GetProjectsService {

    private final ProjectRepository repository;

    public GetProjectsService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<Project> execute() {
        return repository.findAll();
    }
}
