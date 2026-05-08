package org.example.electronics.dto.response.admin.warehouse;

import org.example.electronics.entity.enums.WarehouseStatus;

import java.time.LocalDateTime;
import java.util.List;

public record AdminWarehouseResponseDTO(
        Integer id,
        String name,
        String line,
        String ward,
        String district,
        String province,
        Integer capacity,
        Integer currentStock,
        List<AdminWarehouseDetailResponseDTO> warehouseDetails,
        WarehouseStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
