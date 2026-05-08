package org.example.electronics.dto.request.admin.status;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;

public record AdminUpdateWarehouseTransactionTypeStatusRequestDTO(

        @NotNull(message = "Loại giao dịch kho không được để trống")
        WarehouseTransactionType type,

        @NotNull(message = "Trạng thái giao dịch kho không được để trống")
        WarehouseTransactionStatus status
) {
}
