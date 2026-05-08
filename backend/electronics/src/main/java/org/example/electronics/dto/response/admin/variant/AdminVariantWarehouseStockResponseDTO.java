package org.example.electronics.dto.response.admin.variant;

public record AdminVariantWarehouseStockResponseDTO(
        Integer warehouseId,
        String warehouseName,
        Integer quantity
) {
}
