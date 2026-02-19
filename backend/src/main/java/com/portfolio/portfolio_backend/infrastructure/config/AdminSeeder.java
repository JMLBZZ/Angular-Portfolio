package com.portfolio.portfolio_backend.infrastructure.config;

import com.portfolio.portfolio_backend.domain.model.Role;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.UserEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AdminSeeder implements ApplicationRunner {

    private final SeedAdminProperties props;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(SeedAdminProperties props, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.props = props;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {

        if (!props.enabled()) {
            return;
        }

        String email = props.email();
        String password = props.password();

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalStateException("Seed admin: email/password doivent être renseignés");
        }

        boolean exists = userRepository.findByEmail(email).isPresent();
        if (exists) {
            return;
        }

        UserEntity admin = new UserEntity(
                email,
                passwordEncoder.encode(password),
                Set.of(Role.ROLE_ADMIN, Role.ROLE_USER)
        );

        userRepository.save(admin);

        System.out.println("Seed admin créé: " + email);
    }
}
