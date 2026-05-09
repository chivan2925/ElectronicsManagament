package org.example.electronics.repository;

import org.example.electronics.entity.PermissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Integer> {

    @Query("SELECT p FROM PermissionEntity p WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(p.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND p.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND p.updatedAt <= :toDate) " +
            ")"
    )
    Page<PermissionEntity> findPermissionsWithFilter(
            @Param("keyword") String keyword,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
