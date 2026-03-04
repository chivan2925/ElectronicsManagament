package org.example.electronics.dto.response;

import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;

public record CategoryResponseDTO(
        Integer id,
        String name,
        String iconUrl,
        String slug,
        Integer parentId,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
