package org.example.electronics.dto.request.admin.warehouse.transaction;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.WarehouseTransactionType;

import java.util.List;

public record AdminWarehouseTransactionRequestDTO(

        @NotBlank(message = "Code giao dịch kho không được để trống")
        @Size(max = 20, message = "Code giao dịch kho không được vượt quá 20 ký tự")
        String code,

        @NotNull(message = "ID kho của giao dịch không được để trống")
        Integer warehouseId,

        Integer orderId,

        Integer returnRequestId,

        @NotNull(message = "Loại giao dịch kho (IMPORT/EXPORT/RETURN) không được để trống")
        WarehouseTransactionType type,

        String note,

        @NotEmpty(message = "Danh sách sản phẩm trong giao dịch kho không được để trống")
        List<@Valid AdminWarehouseTransactionDetailRequestDTO> warehouseTransactionDetails
) {
}
