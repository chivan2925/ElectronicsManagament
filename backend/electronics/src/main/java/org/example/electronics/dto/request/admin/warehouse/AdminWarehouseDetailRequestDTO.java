package org.example.electronics.dto.request.admin.warehouse;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AdminWarehouseDetailRequestDTO(

        @NotNull(message = "ID của biến thể sản phẩm không được để trống")
        Integer variantId,

        @NotNull(message = "Số lượng không được để trống")
        @Min(value = 0, message = "Số lượng không được âm")
        Integer quantity
) {}
