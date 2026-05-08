package org.example.electronics.dto.response.admin.warehouse;

public record AdminWarehouseDetailResponseDTO(
        Integer variantId,
        String variantName,
        Integer quantity
) {
}
