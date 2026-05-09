package org.example.electronics.dto.request.user.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UserCreateOrderItemRequestDTO(

        @NotNull(message = "Biến thể sản phẩm không được để trống")
        Integer variantId,

        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
        Integer quantity
) {
}
