package org.example.electronics.repository;

import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.example.electronics.entity.warehouse.transaction.WarehouseTransactionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface WarehouseTransactionRepository extends JpaRepository<WarehouseTransactionEntity, Integer> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Integer id);

    @EntityGraph(attributePaths = {"warehouse", "staff"})
    @Query("SELECT wt FROM WarehouseTransactionEntity wt WHERE 1=1 " +

            "AND (:keyword IS NULL OR (" +
            "   CAST(wt.id AS STRING) LIKE CONCAT('%', :keyword, '%')" +
            "   OR LOWER(wt.code) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            "))" +

            "AND (:type IS NULL OR wt.type = :type) " +
            "AND (:status IS NULL OR wt.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND wt.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND wt.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND wt.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND wt.updatedAt <= :toDate) " +
            ")"
    )
    Page<WarehouseTransactionEntity> findWarehouseTransactionsWithFilter(
            @Param("keyword") String keyword,
            @Param("type") WarehouseTransactionType type,
            @Param("status") WarehouseTransactionStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"warehouse", "staff"})
    @Query("SELECT wt FROM WarehouseTransactionEntity wt " +
            "LEFT JOIN FETCH wt.warehouseTransactionDetails wTD " +
            "LEFT JOIN FETCH wTD.variant " +
            "WHERE wt.id = :id")
    Optional<WarehouseTransactionEntity> findWarehouseTransactionWithDetailsById(@Param("id") Integer id);

    Optional<WarehouseTransactionEntity> findByOrderAndType(OrderEntity orderEntity, WarehouseTransactionType type);

    @Query("SELECT wt.warehouse FROM WarehouseTransactionEntity wt " +
            "JOIN wt.warehouseTransactionDetails wtd " +
            "WHERE wt.order.id = :orderId " +
            "AND wt.type = :type " +
            "AND wtd.variant.id = :variantId")
    Optional<WarehouseEntity> findSourceWarehouseForOrderItem(
            @Param("orderId") Integer orderId,
            @Param("variantId") Integer variantId,
            @Param("type") WarehouseTransactionType type
    );
}
