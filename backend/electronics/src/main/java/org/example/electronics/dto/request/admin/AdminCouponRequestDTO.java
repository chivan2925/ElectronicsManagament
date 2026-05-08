package org.example.electronics.dto.request.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponType;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record AdminCouponRequestDTO(

        Integer categoryId,
        Integer brandId,

        @NotBlank(message = "Code của coupon không được để trống")
        @Size(max = 20, message = "Code coupon không được vượt quá 20 ký tự")
        String code,

        @NotNull(message = "Loại của coupon không được để trống")
        CouponType type,

        @NotNull(message = "Giá trị của coupon không được để trống")
        @Positive(message = "Giá trị của coupon phải lớn hơn 0")
        BigDecimal value,

        @NotNull(message = "Giá trị đơn hàng tối thiểu không được để trống")
        @PositiveOrZero(message = "Giá trị đơn hàng tối thiểu của coupon không được âm")
        BigDecimal minOrder,

        @NotNull(message = "Ngày bắt đầu của coupon không được để trống")
        @FutureOrPresent(message = "Ngày bắt đầu phải từ thời điểm hiện tại trở đi")
        LocalDateTime startDate,

        @NotNull(message = "Ngày kết thúc của coupon không được để trống")
        @Future(message = "Ngày kết thúc phải nằm ở tương lai")
        LocalDateTime endDate,

        @Positive(message = "Lượt dùng tối đa của coupon phải lớn hơn 0")
        Integer usageLimit,

        @PositiveOrZero(message = "Lượng giá giảm tối đa của coupon không được âm")
        BigDecimal maxDiscount,

        @NotNull(message = "Trạng thái  của coupon không được để trống")
        CouponStatus status
) {
}
