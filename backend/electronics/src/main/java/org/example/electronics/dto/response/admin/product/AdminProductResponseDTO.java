package org.example.electronics.dto.response.admin.product;

public record AdminProductResponseDTO(
        Integer id,

        String name,

        String slug,

        String categoryName,

        String brandName,

        String primaryImageUrl
) {
}
