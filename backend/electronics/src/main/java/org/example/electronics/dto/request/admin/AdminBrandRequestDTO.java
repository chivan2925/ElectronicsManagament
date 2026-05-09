package org.example.electronics.dto.request.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.ProductStatus;

public record AdminBrandRequestDTO(
        @NotBlank(message = "Tên thương hiệu không được để trống")
        @Size(max = 100, message = "Tên thương hiệu không được vượt quá 100 ký tự")
        String name,

        @NotBlank(message = "Slug thương hiệu không được để trống")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang")
        String slug,

        String imageUrl,

        @Size(max = 1000, message = "Mô tả thương hiệu không được vượt quá 1000 ký tự")
        String description,

        Boolean featured,

        @NotNull(message = "Trạng thái thương hiệu không được để trống")
        ProductStatus status
) {
}
