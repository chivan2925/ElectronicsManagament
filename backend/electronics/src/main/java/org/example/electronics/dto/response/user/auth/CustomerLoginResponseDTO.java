package org.example.electronics.dto.response.user.auth;

import org.example.electronics.entity.enums.UserStatus;

import java.util.List;

public record CustomerLoginResponseDTO(

        String accessToken,

        String tokenType,

        Integer id,

        Integer userId,

        String fullName,

        String email,

        String phone,

        String role,

        List<String> roles,

        String accountType,

        UserStatus status
) {
    public CustomerLoginResponseDTO(
            String accessToken,
            Integer id,
            String fullName,
            String email,
            String phone,
            UserStatus status
    ) {
        this(
                accessToken,
                "Bearer",
                id,
                id,
                fullName,
                email,
                phone,
                "USER",
                List.of("USER"),
                "user",
                status
        );
    }
}
