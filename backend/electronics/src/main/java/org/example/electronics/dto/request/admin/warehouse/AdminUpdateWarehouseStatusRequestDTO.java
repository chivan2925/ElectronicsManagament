package org.example.electronics.dto.request.admin.warehouse;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.WarehouseStatus;

public record AdminUpdateWarehouseStatusRequestDTO(
        @NotNull(message = "Trạng thái kho không được để trống")
        WarehouseStatus status
) {
}
