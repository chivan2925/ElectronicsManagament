package org.example.electronics.dto.response.user.auth;

import org.example.electronics.entity.enums.UserStatus;

public record CustomerRegisterResponseDTO(

        Integer id,

        String fullName,

        String email,

        String phone,

        String role,

        UserStatus status
) {
}
