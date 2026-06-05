package com.seruca.controller;

import com.seruca.entity.Course;
import com.seruca.entity.Document;
import com.seruca.entity.TaxonomyCategory;
import com.seruca.entity.User;
import com.seruca.repository.CourseRepository;
import com.seruca.repository.DocumentRepository;
import com.seruca.repository.TaxonomyCategoryRepository;
import com.seruca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


/ ============================================================
// USER MANAGEMENT
// ============================================================
@RestController
@RequestMapping("/api/users")
class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // GET all users — Admin only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT update role — Admin only
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateRole(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        return userRepository.findById(id).map(user -> {
            user.setRole(User.Role.valueOf(body.get("role")));
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PUT update profile (firstName, lastName, email, password)
    // Admin can update anyone; a user can update themselves (checked via username in token)
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id,
                                           @RequestBody Map<String, String> body,
                                           java.security.Principal principal) {
        return userRepository.findById(id).map(user -> {
            // Only allow if caller is ADMIN or is the same user
            User caller = userRepository.findByUsername(principal.getName()).orElse(null);
            if (caller == null) return ResponseEntity.status(403).build();
            boolean isSelf = caller.getId().equals(id);
            boolean isAdmin = caller.getRole() == User.Role.ADMIN;
            if (!isSelf && !isAdmin) return ResponseEntity.status(403).build();

            // Apply allowed updates
            if (body.containsKey("firstName") && !body.get("firstName").isBlank()) {
                user.setFirstName(body.get("firstName"));
            }
            if (body.containsKey("lastName") && !body.get("lastName").isBlank()) {
                user.setLastName(body.get("lastName"));
            }
            if (body.containsKey("email") && !body.get("email").isBlank()) {
                // Check email not already taken by someone else
                userRepository.findByEmail(body.get("email")).ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Email already in use");
                    }
                });
                user.setEmail(body.get("email"));
            }
            if (body.containsKey("password") && !body.get("password").isBlank()) {
                user.setPassword(passwordEncoder.encode(body.get("password")));
            }

            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PUT toggle active/inactive — Admin only
    @PutMapping("/{id}/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> toggleActive(@PathVariable Long id,
                                             @RequestBody Map<String, Boolean> body) {
        return userRepository.findById(id).map(user -> {
            user.setActive(body.getOrDefault("active", true));
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE user — Admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}