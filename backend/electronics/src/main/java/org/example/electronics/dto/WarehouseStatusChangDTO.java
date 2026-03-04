package org.example.electronics.dto;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.WarehouseStatus;

public record WarehouseStatusChangDTO(
        @NotNull(message = "Trạng thái kho không được để trống")
        WarehouseStatus status
) {
}
