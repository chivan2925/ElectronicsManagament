package org.example.electronics.dto.request.admin.status;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.ReturnRequestStatus;

public record AdminUpdateReturnRequestStatusRequestDTO(
        @NotNull(message = "Trạng thái yêu cầu trả hàng không được để trống")
        ReturnRequestStatus status
) {
}
