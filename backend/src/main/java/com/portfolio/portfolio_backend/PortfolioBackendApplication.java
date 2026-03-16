package com.portfolio.portfolio_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.portfolio.portfolio_backend.infrastructure.config.UploadProperties;

@ConfigurationPropertiesScan
@SpringBootApplication
@EnableConfigurationProperties(UploadProperties.class)

public class PortfolioBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioBackendApplication.class, args);
	}

}
