package org.example.electronics.dto.response.admin;

import org.example.electronics.entity.enums.GenderType;
import org.example.electronics.entity.enums.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminStaffResponseDTO(
        Integer id,

        String fullName,

        GenderType gender,

        LocalDate dateOfBirth,

        String username,

        String avatarUrl,

        String email,

        String phoneNumber,

        String address,

        Integer roleId,

        String roleName,

        String rawPassword,

        String hashedPassword,

        UserStatus status,

        LocalDateTime assignedAt,

        LocalDateTime updatedAt
) {
}
