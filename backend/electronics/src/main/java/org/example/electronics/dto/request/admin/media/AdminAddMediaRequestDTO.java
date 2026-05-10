package org.example.electronics.dto.request.admin.media;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record AdminAddMediaRequestDTO(

        Integer productId,

        Integer variantId,

        @NotBlank(message = "Đường dẫn hình ảnh media không được để trống")
        String imageUrl,

        @NotBlank(message = "Public ID ảnh không được để trống")
        String publicId,

        @NotNull(message = "isPrimary không được null")
        Boolean isPrimary,

        @NotNull(message = "Thứ tự hiển thị media không được null")
        @PositiveOrZero
        Integer displayOrder
) {
}
