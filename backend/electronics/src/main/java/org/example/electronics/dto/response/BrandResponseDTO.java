package org.example.electronics.dto.response;

import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;

public record BrandResponseDTO(
        Integer id,
        String name,
        String imageUrl,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
