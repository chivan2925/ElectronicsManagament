package org.example.electronics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.example.electronics.entity.order.OrderEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(
        name = "payment_transactions",
        check = {
                @CheckConstraint(name = "chk_amount_positive", constraint = "amount > 0")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_request_id")
    private ReturnRequestEntity returnRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentTransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentProvider provider;

    @Column(name = "provider_payment_id")
    private String providerPaymentId;

    @Column(precision = 12, scale = 3, nullable = false)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentTransactionStatus status = PaymentTransactionStatus.PENDING;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload_json", columnDefinition = "json")
    private Map<String, Object> payloadJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false )
    private LocalDateTime createdAt;
}