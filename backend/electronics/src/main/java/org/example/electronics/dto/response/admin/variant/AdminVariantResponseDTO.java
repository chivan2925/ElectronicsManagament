package org.example.electronics.dto.response.admin.variant;

import org.example.electronics.entity.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminVariantResponseDTO(
        Integer id,

        Integer productId,

        String productName,

        String name,

        String slug,

        String color,

        BigDecimal price,

        String primaryImageUrl,

        ProductStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
