package org.example.electronics.entity.order;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.CouponEntity;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "orders",
        check = {
                @CheckConstraint(name = "chk_discount_non_negative", constraint = "discount >= 0"),
                @CheckConstraint(name = "chk_discount_smaller_or_equal_subtotal", constraint = "discount <= subtotal"),
                @CheckConstraint(name = "chk_shipping_fee_non_negative", constraint = "shipping_fee >= 0"),
                @CheckConstraint(name = "chk_subtotal_non_negative", constraint = "subtotal >= 0"),
                @CheckConstraint(name = "chk_total_non_negative", constraint = "total >= 0"),
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderDetailEntity> orderDetails = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private CouponEntity coupon;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "shipping_name", nullable = false, length = 100)
    private String shippingName;

    @Column(name = "shipping_phone", nullable = false, length = 10)
    private String shippingPhone;

    @Column(name = "shipping_line", nullable = false)
    private String shippingLine;

    @Column(name = "shipping_ward", nullable = false, length = 50)
    private String shippingWard;

    @Column(name = "shipping_district", nullable = false, length = 50)
    private String shippingDistrict;

    @Column(name = "shipping_province", nullable = false, length = 50)
    private String shippingProvince;

    @Column(name = "tracking_code", unique = true, length = 20)
    private String trackingCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethodType paymentMethodType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "shipping_fee", nullable = false)
    private BigDecimal shippingFee;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_provider", nullable = false)
    private ShippingProvider shippingProvider;

    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_status", nullable = false)
    @Builder.Default
    private ShippingStatus shippingStatus = ShippingStatus.PENDING;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void addOrderDetail(OrderDetailEntity orderDetailEntity) {
        this.orderDetails.add(orderDetailEntity);
        orderDetailEntity.setOrder(this);
    }

    public void removeOrderDetail(OrderDetailEntity orderDetailEntity) {
        this.orderDetails.remove(orderDetailEntity);
        orderDetailEntity.setOrder(null);
    }
}
