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
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {

    long countByCoupon_Id(Integer couponId);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT o FROM OrderEntity o WHERE 1=1 " +

            "AND (CAST(:keyword AS string) IS NULL OR ( " +
            "    CAST(o.id AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') " +
            "    OR LOWER(o.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "    OR LOWER(o.shippingName) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "    OR o.shippingPhone LIKE CONCAT('%', CAST(:keyword AS string), '%') " +
            ")) " +

            "AND (CAST(:status AS string) IS NULL OR o.status = :status) " +
            "AND (CAST(:paymentMethodType AS string) IS NULL OR o.paymentMethodType = :paymentMethodType) " +
            "AND (CAST(:paymentStatus AS string) IS NULL OR o.paymentStatus = :paymentStatus) " +
            "AND (CAST(:provider AS string) IS NULL OR o.shippingProvider = :provider) " +
            "AND (CAST(:shippingStatus AS string) IS NULL OR o.shippingStatus = :shippingStatus) " +

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

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT o FROM OrderEntity o WHERE o.user.id = :userId")
    Page<OrderEntity> findOrdersByUserId(@Param("userId") Integer userId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "coupon", "orderDetails", "orderDetails.variant", "orderDetails.variant.product"})
    @Query("SELECT o FROM OrderEntity o WHERE o.id = :orderId AND o.user.id = :userId")
    Optional<OrderEntity> findOrderByIdAndUserIdWithDetails(
            @Param("orderId") Integer orderId,
            @Param("userId") Integer userId
    );

    @Query("SELECT o FROM OrderEntity o WHERE o.status = 'PENDING' AND o.createdAt <= :thresholdTime")
    Page<OrderEntity> findExpiredPendingOrders(@Param("thresholdTime") LocalDateTime thresholdTime, Pageable pageable);

    @Query("SELECT o FROM OrderEntity o " +
            "LEFT JOIN FETCH o.orderDetails od " +
            "LEFT JOIN FETCH od.variant v " +
            "LEFT JOIN FETCH v.product p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.brand " +
            "WHERE o.createdAt >= :fromDate AND o.createdAt <= :toDate")
    List<OrderEntity> findOrdersForReport(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );
}
