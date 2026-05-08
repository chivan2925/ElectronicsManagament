package org.example.electronics.dto.response.admin;

import lombok.Builder;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponTimeStatus;
import org.example.electronics.entity.enums.CouponType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminCouponResponseDTO(

        Integer id,
        Integer categoryId,
        Integer brandId,
        String code,
        CouponType type,
        BigDecimal value,
        BigDecimal minOrder,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Integer usageLimit,
        BigDecimal maxDiscount,
        CouponTimeStatus timeStatus,
        CouponStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
