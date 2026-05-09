package org.example.electronics.repository;

import org.example.electronics.entity.CouponEntity;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponTimeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface CouponRepository extends JpaRepository<CouponEntity, Integer> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Integer id);

    @Query("SELECT c FROM CouponEntity c WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(c.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:timeStatus IS NULL OR " +
            "    (:timeStatus = 'VALID' AND CURRENT_TIMESTAMP >= c.startDate AND CURRENT_TIMESTAMP <= c.endDate) OR " +
            "    (:timeStatus = 'EXPIRED' AND (CURRENT_TIMESTAMP < c.startDate OR CURRENT_TIMESTAMP > c.endDate)) " +
            ") " +

            "AND (:status IS NULL OR c.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND c.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND c.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND c.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND c.updatedAt <= :toDate) " +
            ")"
    )
    Page<CouponEntity> findCouponsWithFilter(
            @Param("keyword") String keyword,
            @Param("timeStatus") CouponTimeStatus timeStatus,
            @Param("status") CouponStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
