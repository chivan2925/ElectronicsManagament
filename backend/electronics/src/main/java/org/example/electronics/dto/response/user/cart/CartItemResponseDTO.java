package org.example.electronics.dto.response.user.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CartItemResponseDTO(
        Integer productId,
        String productName,
        String productSlug,
        Integer brandId,
        String brandName,
        Integer categoryId,
        String categoryName,
        Integer variantId,
        String variantName,
        String imageUrl,
        BigDecimal unitPrice,
        Integer quantity,
        Integer maxQuantity,
        String status,
        LocalDateTime updatedAt
) {
}
