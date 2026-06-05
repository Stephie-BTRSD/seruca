package com.seruca.service;

import com.seruca.dto.UserProfileUpdateRequest;
import com.seruca.dto.UserResponse;
import com.seruca.entity.User;
import com.seruca.exception.DuplicateFieldException;
import com.seruca.exception.ForbiddenException;
import com.seruca.exception.ResourceNotFoundException;
import com.seruca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // ── READ ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = findOrThrow(id);
        return UserResponse.from(user);
    }

    // ── UPDATE ROLE ───────────────────────────────────────────────────────────

    public UserResponse updateRole(Long id, String role) {
        User user = findOrThrow(id);
        try {
            user.setRole(User.Role.valueOf(role));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role + ". Must be ADMIN, LECTURER or STUDENT.");
        }
        return UserResponse.from(userRepository.save(user));
    }

    // ── UPDATE PROFILE ────────────────────────────────────────────────────────

    /**
     * Updates profile fields for a user.
     * callerUsername: the authenticated user making the request (from JWT).
     * Only the user themselves OR an ADMIN may update a profile.
     */
    public UserResponse updateProfile(Long targetId, UserProfileUpdateRequest request, String callerUsername) {
        User caller = userRepository.findByUsername(callerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Caller user not found"));

        User target = findOrThrow(targetId);

        boolean isSelf  = caller.getId().equals(targetId);
        boolean isAdmin = caller.getRole() == User.Role.ADMIN;

        if (!isSelf && !isAdmin) {
            throw new ForbiddenException("You can only update your own profile");
        }

        // Apply updates — only non-blank fields are changed
        if (hasValue(request.getFirstName())) {
            target.setFirstName(request.getFirstName().trim());
        }
        if (hasValue(request.getLastName())) {
            target.setLastName(request.getLastName().trim());
        }
        if (hasValue(request.getEmail())) {
            String newEmail = request.getEmail().trim();
            userRepository.findByEmail(newEmail).ifPresent(existing -> {
                if (!existing.getId().equals(targetId)) {
                    throw new DuplicateFieldException("Email is already in use by another account");
                }
            });
            target.setEmail(newEmail);
        }
        if (hasValue(request.getPassword())) {
            target.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return UserResponse.from(userRepository.save(target));
    }

    // ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────

    public UserResponse setActive(Long id, boolean active) {
        User user = findOrThrow(id);
        user.setActive(active);
        return UserResponse.from(userRepository.save(user));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private boolean hasValue(String s) {
        return s != null && !s.isBlank();
    }
}