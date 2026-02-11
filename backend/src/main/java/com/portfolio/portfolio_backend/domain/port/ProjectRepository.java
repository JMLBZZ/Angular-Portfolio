package com.portfolio.portfolio_backend.domain.port;

import com.portfolio.portfolio_backend.domain.model.Project;
import java.util.List;

public interface ProjectRepository {

    List<Project> findAll();

}
