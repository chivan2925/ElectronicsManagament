package org.example.electronics.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(
        @NotBlank(message = "Tên danh mục không được để trống")
        String name,

        String iconUrl,

        @NotBlank(message = "Slug danh mục không được để trống")
        String slug,

        Integer parentId
) {
}
