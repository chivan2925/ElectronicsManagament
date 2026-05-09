package org.example.electronics.dto.request.admin.warehouse.transaction;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AdminWarehouseTransactionDetailRequestDTO(

        @NotNull(message = "ID sản phẩm (variant) không được để trống")
        Integer variantId,

        @NotNull(message = "Số lượng không được để trống")
        @Min(value = 1, message = "Số lượng phải lớn hơn 0")
        Integer quantity
) {
}
