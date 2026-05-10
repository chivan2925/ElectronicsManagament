package org.example.electronics.dto.response.admin;

import java.time.LocalDateTime;

public record AdminMediaResponseDTO(
        Integer id,

        Integer productId,

        Integer variantId,

        String productName,

        String variantName,

        String variantSku,

        String imageUrl,

        String publicId,

        Boolean isPrimary,

        Integer displayOrder,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
