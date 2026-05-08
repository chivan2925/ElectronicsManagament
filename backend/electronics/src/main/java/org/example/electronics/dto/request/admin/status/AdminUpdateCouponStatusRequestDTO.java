package org.example.electronics.dto.request.admin.status;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.CouponStatus;

public record AdminUpdateCouponStatusRequestDTO(
        @NotNull(message = "Trạng thái coupon không được để trống")
        CouponStatus status
) {
}
