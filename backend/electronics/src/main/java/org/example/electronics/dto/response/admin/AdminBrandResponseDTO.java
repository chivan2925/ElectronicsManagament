package org.example.electronics.dto.response.admin;

import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;

public record AdminBrandResponseDTO(
        Integer id,
        String name,
        String imageUrl,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
