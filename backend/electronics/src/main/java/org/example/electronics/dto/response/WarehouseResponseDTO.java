package org.example.electronics.dto.response;

import org.example.electronics.entity.enums.WarehouseStatus;

import java.time.LocalDateTime;

public record WarehouseResponseDTO(
        Integer id,
        String name,
        String line,
        String ward,
        String district,
        String province,
        Integer capacity,
        Integer currentStock,
        WarehouseStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
