package org.example.electronics.repository;

import org.example.electronics.entity.enums.*;
import org.example.electronics.entity.order.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT o FROM OrderEntity o WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(o.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(o.code) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(o.shippingName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR o.shippingPhone LIKE CONCAT('%', :keyword, '%') " +
            ")) " +

            "AND (:status IS NULL OR o.status = :status) " +
            "AND (:paymentMethodType IS NULL OR o.paymentMethodType = :paymentMethodType) " +
            "AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
            "AND (:provider IS NULL OR o.shippingProvider = :provider) " +
            "AND (:shippingStatus IS NULL OR o.shippingStatus = :shippingStatus) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND o.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND o.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND o.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND o.updatedAt <= :toDate) " +
            ")"
    )
    Page<OrderEntity> findOrdersWithFilter(
            @Param("keyword") String keyword,
            @Param("status") OrderStatus status,
            @Param("paymentMethodType") PaymentMethodType paymentMethodType,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("provider") ShippingProvider provider,
            @Param("shippingStatus") ShippingStatus shippingStatus,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"user", "coupon", "orderDetails", "orderDetails.variant", "orderDetails.variant.product"})
    @Query("SELECT o FROM OrderEntity o WHERE o.id = :id")
    Optional<OrderEntity> findOrderByIdWithDetails(@Param("id") Integer orderId);

    @Query("SELECT o FROM OrderEntity o WHERE o.status = 'PENDING' AND o.createdAt <= :thresholdTime")
    Page<OrderEntity> findExpiredPendingOrders(@Param("thresholdTime") LocalDateTime thresholdTime, Pageable pageable);
}
