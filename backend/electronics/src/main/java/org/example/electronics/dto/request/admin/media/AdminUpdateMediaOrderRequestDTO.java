package org.example.electronics.dto.request.admin.media;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record AdminUpdateMediaOrderRequestDTO(
        @NotNull(message = "Thứ tự hiển thị không được null")
        @PositiveOrZero
        Integer displayOrder
) {
}
