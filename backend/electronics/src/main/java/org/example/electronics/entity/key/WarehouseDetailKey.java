package org.example.electronics.entity.key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class WarehouseDetailKey implements Serializable {

    @Column(name = "warehouse_id", nullable = false)
    private Integer warehouseId;

    @Column(name = "variant_id", nullable = false)
    private Integer variantId;
}
