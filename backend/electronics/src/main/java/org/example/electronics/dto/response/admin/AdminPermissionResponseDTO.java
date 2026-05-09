package org.example.electronics.dto.response.admin;

import java.time.LocalDateTime;

public record AdminPermissionResponseDTO(
        Integer id,

        String code,

        String name,

        String description,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
