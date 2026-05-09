package org.example.electronics.repository;

import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, Integer> {

    Optional<PaymentTransactionEntity> findByOrderId(Integer id);

    Optional<PaymentTransactionEntity> findByOrderIdAndTypeAndStatus(Integer id, PaymentTransactionType type, PaymentTransactionStatus status);

    boolean existsByProviderPaymentId(String id);

    @Query(value = "SELECT p FROM PaymentTransactionEntity p " +
            "LEFT JOIN FETCH p.order " +
            "LEFT JOIN FETCH p.returnRequest " +
            "WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(p.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(p.providerPaymentId) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(p.note) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:type IS NULL OR p.type = :type) " +
            "AND (:status IS NULL OR p.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt <= :toDate) " +
            ")",

            countQuery = "SELECT COUNT(p) FROM PaymentTransactionEntity p " +
                    "WHERE 1=1 " +
                    "AND (:keyword IS NULL OR ( " +
                    "    CAST(p.id AS string) LIKE CONCAT('%', :keyword, '%') " +
                    "    OR LOWER(p.providerPaymentId) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(p.note) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    ")) " +
                    "AND (:type IS NULL OR p.type = :type) " +
                    "AND (:status IS NULL OR p.status = :status) " +

                    "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
                    "    (:dateType = 'CREATED_AT' AND p.createdAt >= :fromDate) " +
                    ") " +

                    "AND (CAST(:toDate AS timestamp) IS NULL OR " +
                    "    (:dateType = 'CREATED_AT' AND p.createdAt <= :toDate) " +
                    ")"
    )
    Page<PaymentTransactionEntity> findPaymentsWithFilter(
            @Param("keyword") String keyword,
            @Param("type") PaymentTransactionType type,
            @Param("status") PaymentTransactionStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
