package org.example.electronics.dto.response.admin.warehouse.transaction;

public record AdminWarehouseTransactionDetailResponseDTO(

        Integer variantId,
        String variantName,
        Integer quantity
) {
}
