package org.example.electronics.dto.request.admin.status;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.UserStatus;

public record AdminUpdateUserStatusRequestDTO(
        @NotNull(message = "Trạng thái của người dùng không được để trống")
        UserStatus status
) {
}
