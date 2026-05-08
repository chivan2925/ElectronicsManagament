package org.example.electronics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.enums.PaymentMethodType;
import org.example.electronics.entity.enums.ReturnRequestStatus;
import org.example.electronics.entity.enums.ReturnRequestType;
import org.example.electronics.entity.order.OrderEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "return_requests",
        check = {
            @CheckConstraint(name = "chk_refund_amount_non_negative", constraint = "refund_amount >= 0"),
            @CheckConstraint(name = "chk_quantity_positive", constraint = "quantity > 0")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private VariantEntity variant;

    @Column(nullable = false)
    Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handled_by_staff_id")
    private StaffEntity handledByStaff;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnRequestType type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "refund_amount", precision = 12, scale = 3, nullable = false)
    private BigDecimal refundAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_method", nullable = false)
    private PaymentMethodType refundMethod;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "evidence_json", columnDefinition = "json")
    private List<String> evidenceJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReturnRequestStatus status = ReturnRequestStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
