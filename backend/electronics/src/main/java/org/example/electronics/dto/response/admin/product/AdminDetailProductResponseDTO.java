package org.example.electronics.dto.response.admin.product;

import org.example.electronics.dto.response.admin.AdminMediaResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantResponseDTO;
import org.example.electronics.entity.enums.ProductStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record AdminDetailProductResponseDTO(
        Integer id,

        String name,

        String slug,

        Integer categoryId,

        String categoryName,

        Integer brandId,

        String brandName,

        String description,

        Map<String, Object> specsJson,

        Float ratingStar,

        Integer ratingCount,

        Integer warrantyMonths,

        List<AdminVariantResponseDTO> variants,

        List<AdminMediaResponseDTO> media,

        ProductStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
