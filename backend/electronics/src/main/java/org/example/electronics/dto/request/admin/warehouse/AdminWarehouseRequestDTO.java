package org.example.electronics.dto.request.admin.warehouse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.WarehouseStatus;

import java.util.List;

public record AdminWarehouseRequestDTO(

        @NotBlank(message = "Tên kho không được để trống")
        String name,

        @NotBlank(message = "Địa chỉ chi tiết kho không được để trống")
        String line,

        @NotBlank(message = "Phường/Xã kho không được để trống")
        String ward,

        @NotBlank(message = "Quận/Huyện kho không được để trống")
        String district,

        @NotBlank(message = "Tỉnh/Thành phố kho không được để trống")
        String province,

        @NotNull(message = "Sức chứa kho không được để trống")
        @Min(value = 0, message = "Sức chứa kho không được âm")
        Integer capacity,

        List<@Valid AdminWarehouseDetailRequestDTO> warehouseDetails,

        @NotNull(message = "Trạng thái kho không được để trống")
        WarehouseStatus status
) {
}
