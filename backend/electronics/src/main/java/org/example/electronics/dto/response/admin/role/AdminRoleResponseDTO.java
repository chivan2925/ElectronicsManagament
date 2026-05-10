package org.example.electronics.dto.response.admin.role;

import org.example.electronics.entity.enums.UserStatus;

import java.time.LocalDateTime;

public record AdminRoleResponseDTO(
        Integer id,

        String name,

        Integer permissionCount,

        Long staffCount,

        UserStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
