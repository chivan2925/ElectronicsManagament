package org.example.electronics.entity.key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class WarehouseTransactionKey implements Serializable {

    @Column(name = "warehouse_transaction_id", nullable = false)
    private Integer warehouseTransactionId;

    @Column(name = "variant_id", nullable = false)
    private Integer variantId;
}
