package org.example.electronics.dto.response.admin;

import org.example.electronics.entity.enums.GenderType;
import org.example.electronics.entity.enums.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminUserResponseDTO(
        Integer id,

        String fullName,

        GenderType gender,

        LocalDate dateOfBirth,

        String username,

        String avatarUrl,

        String email,

        String phoneNumber,

        UserStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
