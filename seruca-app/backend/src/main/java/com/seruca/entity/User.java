package com.seruca.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable=false)
    private String username;

    @Column(unique=true, nullable=false)
    private String email;

    @JsonIgnore
    @Column(nullable=false)
    private String password;

    @Column(nullable=false)
    private String firstName;

    @Column(nullable=false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Role role;

    @Column(nullable=false)
    private boolean active = true;

    @Column(updatable=false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public User() {}

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private Long id; private String username, email, password, firstName, lastName;
        private Role role; private boolean active = true;
        public UserBuilder id(Long i) { this.id=i; return this; }
        public UserBuilder username(String u) { this.username=u; return this; }
        public UserBuilder email(String e) { this.email=e; return this; }
        public UserBuilder password(String p) { this.password=p; return this; }
        public UserBuilder firstName(String f) { this.firstName=f; return this; }
        public UserBuilder lastName(String l) { this.lastName=l; return this; }
        public UserBuilder role(Role r) { this.role=r; return this; }
        public UserBuilder active(boolean a) { this.active=a; return this; }
        public User build() {
            User u = new User(); u.id=id; u.username=username; u.email=email;
            u.password=password; u.firstName=firstName; u.lastName=lastName;
            u.role=role; u.active=active; return u;
        }
    }

    public Long getId() { return id; } public void setId(Long id) { this.id=id; }
    public String getUsername() { return username; } public void setUsername(String u) { this.username=u; }
    public String getEmail() { return email; } public void setEmail(String e) { this.email=e; }
    public String getPassword() { return password; } public void setPassword(String p) { this.password=p; }
    public String getFirstName() { return firstName; } public void setFirstName(String f) { this.firstName=f; }
    public String getLastName() { return lastName; } public void setLastName(String l) { this.lastName=l; }
    public Role getRole() { return role; } public void setRole(Role r) { this.role=r; }
    public boolean isActive() { return active; } public void setActive(boolean a) { this.active=a; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public enum Role { ADMIN, LECTURER, STUDENT }
}
