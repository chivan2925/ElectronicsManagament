package org.example.electronics.entity.warehouse;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.enums.WarehouseStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "warehouses",
        check = {
                @CheckConstraint(name = "chk_capacity_non_negative", constraint = "capacity >= 0"),
                @CheckConstraint(name = "chk_current_stock_non_negative", constraint = "current_stock >= 0"),
                @CheckConstraint(name = "chk_stock_within_capacity", constraint = "current_stock <= capacity")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WarehouseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String line;

    @Column(nullable = false, length = 50)
    private String ward;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(nullable = false, length = 50)
    private String province;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "current_stock", nullable = false)
    @Builder.Default
    private Integer currentStock = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WarehouseStatus status = WarehouseStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WarehouseDetailEntity> warehouseDetails = new ArrayList<>();

    public void addWarehouseDetail(WarehouseDetailEntity warehouseDetailEntity) {
        warehouseDetails.add(warehouseDetailEntity);
        warehouseDetailEntity.setWarehouse(this);
    }

    public void removeWarehouseDetail(WarehouseDetailEntity warehouseDetailEntity) {
        warehouseDetails.remove(warehouseDetailEntity);
        warehouseDetailEntity.setWarehouse(null);
    }
}