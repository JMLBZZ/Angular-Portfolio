package com.portfolio.portfolio_backend.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Portfolio API")
                        .version("1.0")
                        .description("API REST pour la gestion de mes projets du portfolio")
                        .contact(new Contact()
                                .name("JML")
                                .email("JML@JML.com")
                        )
                        .license(new License()
                                .name("Master Degree - Directeur de projet en conception et développement de solutions informatiques")
                        )
                );
    }
}
