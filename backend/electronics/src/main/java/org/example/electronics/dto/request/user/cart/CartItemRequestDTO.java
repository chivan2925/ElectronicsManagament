package org.example.electronics.dto.request.user.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequestDTO(

        @NotNull(message = "Biến thể sản phẩm không được để trống")
        Integer variantId,

        @NotNull(message = "Số lượng không được để trống")
        @Min(value = 1, message = "Số lượng tối thiểu là 1")
        @Max(value = 99, message = "Số lượng tối đa là 99")
        Integer quantity
) {
}
