package org.example.electronics.dto.request.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.ProductStatus;

public record AdminBrandRequestDTO(
        @NotBlank(message = "Tên thương hiệu không được để trống")
        @Size(max = 100, message = "Tên thương hiệu không được vượt quá 100 ký tự")
        String name,

        String imageUrl,

        @NotNull(message = "Trạng thái thương hiệu không được để trống")
        ProductStatus status
) {
}
