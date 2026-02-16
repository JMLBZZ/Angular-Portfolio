package com.portfolio.portfolio_backend.domain.model;

import java.util.Set;

public class User {

    private Long id;
    private String email;
    private String password;
    private Set<Role> roles;

    public User(Long id, String email, String password, Set<Role> roles) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Set<Role> getRoles() { return roles; }
}
