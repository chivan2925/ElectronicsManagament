package org.example.electronics.dto.response.admin.role;

import org.example.electronics.dto.response.admin.AdminPermissionResponseDTO;
import org.example.electronics.entity.enums.UserStatus;

import java.time.LocalDateTime;
import java.util.Set;

public record AdminDetailRoleResponseDTO(
        Integer id,

        String name,

        Set<AdminPermissionResponseDTO> permissions,

        UserStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
