package org.example.electronics.dto.response.admin;

import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;

public record AdminBrandResponseDTO(
        Integer id,
        String name,
        String slug,
        String imageUrl,
        String description,
        Boolean featured,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
