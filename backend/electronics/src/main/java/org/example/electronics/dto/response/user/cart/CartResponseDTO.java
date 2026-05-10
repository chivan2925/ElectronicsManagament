package org.example.electronics.dto.response.user.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CartResponseDTO(
        Integer id,
        Integer userId,
        List<CartItemResponseDTO> items,
        Integer itemCount,
        BigDecimal subtotal,
        LocalDateTime updatedAt
) {
}
