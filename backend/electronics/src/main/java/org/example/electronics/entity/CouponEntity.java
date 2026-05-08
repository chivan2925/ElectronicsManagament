package org.example.electronics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "coupons",
        check = {
                @CheckConstraint(name = "chk_value_non_negative", constraint = "value > 0"),
                @CheckConstraint(name = "chk_min_order_non_negative", constraint = "min_order >= 0"),
                @CheckConstraint(name = "chk_usage_limit_non_negative", constraint = "usage_limit > 0")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "category_id")
        private CategoryEntity category;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "brand_id")
        private BrandEntity brand;

        @Column(nullable = false, unique = true, length = 20)
        private String code;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private CouponType type;

        @Column(nullable = false, precision = 12, scale = 3)
        private BigDecimal value;

        @Column(name = "min_order", precision = 12, scale = 3, nullable = false)
        private BigDecimal minOrder;

        @Column(name = "start_date", nullable = false)
        private LocalDateTime startDate;

        @Column(name = "end_date", nullable = false)
        private LocalDateTime endDate;

        @Column(name = "usage_limit")
        private Integer usageLimit;

        @Column(name = "max_discount", precision = 12, scale = 3)
        private BigDecimal maxDiscount;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        @Builder.Default
        private CouponStatus status = CouponStatus.ACTIVE;

        @CreationTimestamp
        @Column(name = "created_at", updatable = false, nullable = false)
        private LocalDateTime createdAt;

        @UpdateTimestamp
        @Column(name = "updated_at", nullable = false)
        private LocalDateTime updatedAt;

        @Transient
        public boolean isValidTime() {
                LocalDateTime now = LocalDateTime.now();
                return (startDate == null || !now.isBefore(startDate)) &&
                        (endDate == null || !now.isAfter(endDate));
        }
}
