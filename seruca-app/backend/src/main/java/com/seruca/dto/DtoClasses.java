package com.seruca.dto;

import com.seruca.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// ---- Auth DTOs ----

@Data
@NoArgsConstructor
@AllArgsConstructor
class AuthRequestData {
    @NotBlank private String username;
    @NotBlank private String password;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class AuthResponseData {
    private String token;
    private String username;
    private String email;
    private String role;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class RegisterRequestData {
    @NotBlank private String username;
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private User.Role role;
}
