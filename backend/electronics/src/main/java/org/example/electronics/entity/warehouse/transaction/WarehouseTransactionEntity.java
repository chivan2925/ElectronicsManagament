package org.example.electronics.entity.warehouse.transaction;

import jakarta.persistence.*;
import lombok.*;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "warehouse_transactions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WarehouseTransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 20)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private WarehouseEntity warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private StaffEntity staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_request_id")
    private ReturnRequestEntity returnRequest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WarehouseTransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WarehouseTransactionStatus status = WarehouseTransactionStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "warehouseTransaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WarehouseTransactionDetailEntity> warehouseTransactionDetails = new ArrayList<>();

    public void addWarehouseTransactionDetail(WarehouseTransactionDetailEntity warehouseTransactionDetailEntity) {
        this.warehouseTransactionDetails.add(warehouseTransactionDetailEntity);
        warehouseTransactionDetailEntity.setWarehouseTransaction(this);
    }

    public void removeWarehouseTransactionDetail(WarehouseTransactionDetailEntity warehouseTransactionDetailEntity) {
        this.warehouseTransactionDetails.remove(warehouseTransactionDetailEntity);
        warehouseTransactionDetailEntity.setWarehouseTransaction(null);
    }
}
