package com.seruca.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body for PUT /api/users/{id}/profile.
 * All fields are optional — only non-blank fields are applied.
 */
@Data
public class UserProfileUpdateRequest {

    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;

    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;

    @Email(message = "Must be a valid email address")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}