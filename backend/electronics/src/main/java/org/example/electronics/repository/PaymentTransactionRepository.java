package org.example.electronics.repository;

import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.PaymentProvider;
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

    Optional<PaymentTransactionEntity> findTopByOrderIdAndTypeOrderByCreatedAtDesc(Integer id, PaymentTransactionType type);

    Optional<PaymentTransactionEntity> findTopByOrderIdAndTypeAndProviderOrderByCreatedAtDesc(
            Integer id,
            PaymentTransactionType type,
            PaymentProvider provider
    );

    boolean existsByProviderPaymentId(String id);

    Optional<PaymentTransactionEntity> findByProviderPaymentId(String providerPaymentId);

    @Query(value = "SELECT p FROM PaymentTransactionEntity p " +
            "LEFT JOIN FETCH p.order " +
            "LEFT JOIN FETCH p.returnRequest " +
            "WHERE 1=1 " +

            "AND (CAST(:keyword AS string) IS NULL OR ( " +
            "    CAST(p.id AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') " +
            "    OR LOWER(p.providerPaymentId) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "    OR LOWER(p.note) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            ")) " +

            "AND (CAST(:type AS string) IS NULL OR p.type = :type) " +
            "AND (CAST(:status AS string) IS NULL OR p.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt <= :toDate) " +
            ")",

            countQuery = "SELECT COUNT(p) FROM PaymentTransactionEntity p " +
                    "WHERE 1=1 " +
                    "AND (CAST(:keyword AS string) IS NULL OR ( " +
                    "    CAST(p.id AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') " +
                    "    OR LOWER(p.providerPaymentId) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
                    "    OR LOWER(p.note) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
                    ")) " +
                    "AND (CAST(:type AS string) IS NULL OR p.type = :type) " +
                    "AND (CAST(:status AS string) IS NULL OR p.status = :status) " +

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
