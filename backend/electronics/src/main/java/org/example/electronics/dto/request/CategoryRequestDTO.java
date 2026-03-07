package org.example.electronics.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(
        @NotBlank(message = "Tên danh mục không được để trống")
        String name,

        String iconUrl,

        @NotBlank(message = "Slug danh mục không được để trống")
        @Schema(description = "Đường dẫn thân thiện cho SEO", example = "laptop-gaming")
        String slug,

        @Schema(description = "ID của danh mục cha. Để null nếu đây là danh mục gốc", example = "1")
        Integer parentId
) {
}
