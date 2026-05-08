package org.example.electronics.dto.response.admin;

import java.time.LocalDateTime;

public record AdminMediaResponseDTO(
        Integer id,

        Integer productId,

        Integer variantId,

        String imageUrl,

        Boolean isPrimary,

        Integer displayOrder,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
