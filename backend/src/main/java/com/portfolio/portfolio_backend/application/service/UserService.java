package com.portfolio.portfolio_backend.application.service;

import com.portfolio.portfolio_backend.domain.model.Role;
import com.portfolio.portfolio_backend.infrastructure.persistence.entity.UserEntity;
import com.portfolio.portfolio_backend.infrastructure.persistence.repository.UserRepository;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity register(String email, String password) {

        String encodedPassword = passwordEncoder.encode(password);

        UserEntity user = new UserEntity(
                email,
                encodedPassword,
                Set.of(Role.ROLE_USER));

        return userRepository.save(user);
    }

    public UserEntity login(String email, String password) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials - Mail invalide"));

        if (!passwordEncoder.matches(password, user.getPassword())) {//Compare pwd brut avec pwd bcrypt
            throw new BadCredentialsException("Invalid credentials - Mot de passe invalide");
        }

        return user;
    }
}
