package org.example.electronics.dto.response.admin.category;

import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;
import java.util.List;

public record AdminDetailCategoryResponseDTO(
        Integer id,

        String name,

        String iconUrl,

        String slug,

        ProductStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        Integer parentId,

        String parentName,

        List<AdminCategoryResponseDTO> subCategoryList
) {
}
