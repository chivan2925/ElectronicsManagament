package org.example.electronics.dto.response.admin.warehouse.transaction;

import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;

import java.time.LocalDateTime;
import java.util.List;

public record AdminWarehouseTransactionResponseDTO(

        Integer id,
        String code,

        Integer warehouseId,
        String warehouseName,

        Integer staffId,
        String staffFullName,

        Integer orderId,

        Integer returnRequestId,

        WarehouseTransactionType type,

        WarehouseTransactionStatus status,

        String note,

        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        List<AdminWarehouseTransactionDetailResponseDTO> warehouseTransactionDetails
) {
}
