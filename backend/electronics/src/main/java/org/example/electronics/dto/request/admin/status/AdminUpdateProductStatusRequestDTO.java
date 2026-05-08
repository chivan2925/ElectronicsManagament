package org.example.electronics.dto.request.admin.status;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.ProductStatus;

public record AdminUpdateProductStatusRequestDTO(
        @NotNull(message = "Trạng thái sản phẩm/biến thể/danh mục/thương hiệu không được để trống")
        ProductStatus status
) {
}
