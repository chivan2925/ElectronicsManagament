package org.example.electronics.entity.warehouse.transaction;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.key.WarehouseTransactionKey;

@Entity
@Table(name = "warehouse_transaction_details",
        check = {
                @CheckConstraint(name = "chk_quantity_positive", constraint = "quantity > 0")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WarehouseTransactionDetailEntity {

    @EmbeddedId
    @Builder.Default
    private WarehouseTransactionKey id = new WarehouseTransactionKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("warehouseTransactionId")
    @JoinColumn(name = "warehouse_transaction_id", nullable = false)
    private WarehouseTransactionEntity warehouseTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("variantId")
    @JoinColumn(name = "variant_id", nullable = false)
    private VariantEntity variant;

    @Column(nullable = false)
    private Integer quantity;
}
