package org.example.electronics.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WarehouseRequestDTO(

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
        @Min(value = 0, message = "Sức chứa không được âm")
        Integer capacity
) {
}
