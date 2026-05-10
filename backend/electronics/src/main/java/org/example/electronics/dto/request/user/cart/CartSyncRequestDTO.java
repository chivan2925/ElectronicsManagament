package org.example.electronics.dto.request.user.cart;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CartSyncRequestDTO(

        @Valid
        @Size(max = 100, message = "Giỏ hàng không được vượt quá 100 dòng sản phẩm")
        List<CartItemRequestDTO> items
) {
}
