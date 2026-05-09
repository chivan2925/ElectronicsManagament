package org.example.electronics.dto.response.admin.product;

import org.example.electronics.entity.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminProductResponseDTO(
        Integer id,

        String name,

        String slug,

        Integer categoryId,

        String categoryName,

        Integer brandId,

        String brandName,

        String primaryImageUrl,

        BigDecimal price,

        Integer stock,

        Boolean featured,

        ProductStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
