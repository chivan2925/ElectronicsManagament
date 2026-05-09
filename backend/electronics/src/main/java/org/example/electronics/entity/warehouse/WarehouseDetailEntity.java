package org.example.electronics.entity.warehouse;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.key.WarehouseDetailKey;

@Entity
@Table(name = "warehouse_details",
        check = {
                @CheckConstraint(name = "chk_quantity_non_negative", constraint = "quantity >= 0")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WarehouseDetailEntity {

    @EmbeddedId
    @Builder.Default
    private WarehouseDetailKey id = new WarehouseDetailKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("warehouseId")
    @JoinColumn(name = "warehouse_id", nullable = false)
    private WarehouseEntity warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("variantId")
    @JoinColumn(name = "variant_id", nullable = false)
    private VariantEntity variant;

    @Column(nullable = false)
    private Integer quantity;
}