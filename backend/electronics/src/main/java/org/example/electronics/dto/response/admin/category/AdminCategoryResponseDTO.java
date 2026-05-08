package org.example.electronics.dto.response.admin.category;

import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;

public record AdminCategoryResponseDTO(
        Integer id,

        String name,

        String iconUrl,

        String slug,

        ProductStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
