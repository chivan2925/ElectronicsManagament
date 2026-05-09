package org.example.electronics.dto.request.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.ProductStatus;

public record AdminCategoryRequestDTO(
        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(max = 50, message = "Tên danh mục không được vượt quá 50 ký tự")
        String name,

        String iconUrl,

        @NotBlank(message = "Slug danh mục không được để trống")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang")
        @Schema(description = "Đường dẫn thân thiện cho SEO", example = "laptop-gaming")
        String slug,

        @Schema(description = "ID của danh mục cha. Để null nếu đây là danh mục gốc", example = "1")
        Integer parentId,

        @NotNull(message = "Trạng thái danh mục không được để trống")
        ProductStatus status
) {
}
