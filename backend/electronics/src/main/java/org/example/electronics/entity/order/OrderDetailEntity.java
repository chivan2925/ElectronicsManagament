package org.example.electronics.entity.order;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.key.OrderDetailKey;

import java.math.BigDecimal;

@Entity
@Table(name = "order_details",
        check = {
                @CheckConstraint(name = "chk_price_non_negative", constraint = "price >= 0"),
                @CheckConstraint(name = "chk_quantity_positive", constraint = "quantity > 0")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailEntity {

    @EmbeddedId
    @Builder.Default
    private OrderDetailKey id = new OrderDetailKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("orderId")
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("variantId")
    @JoinColumn(name = "variant_id", nullable = false)
    private VariantEntity variant;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;
}
