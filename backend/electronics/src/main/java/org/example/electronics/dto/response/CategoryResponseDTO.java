package org.example.electronics.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;

public record CategoryResponseDTO(
        Integer id,
        String name,
        String iconUrl,
        @Schema(description = "Đường dẫn thân thiện cho SEO", example = "laptop-gaming")
        String slug,
        @Schema(description = "ID của danh mục cha. Để null nếu đây là danh mục gốc", example = "1")
        Integer parentId,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
