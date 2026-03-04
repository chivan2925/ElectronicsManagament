package org.example.electronics.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BrandRequestDTO(
        @NotBlank(message = "Tên thương hiệu không được để trống")
        String name,

        String imageUrl
) {
}
