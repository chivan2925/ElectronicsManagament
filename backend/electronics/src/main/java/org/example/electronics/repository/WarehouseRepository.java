package org.example.electronics.repository;

import org.example.electronics.entity.enums.WarehouseStatus;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<WarehouseEntity, Integer> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Integer id);

    @Query("SELECT w FROM WarehouseEntity w WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(w.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(w.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR w.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND w.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND w.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND w.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND w.updatedAt <= :toDate) " +
            ")"
    )
    Page<WarehouseEntity> findWarehousesWithFilter(
            @Param("keyword") String keyword,
            @Param("status") WarehouseStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    @Query("SELECT w FROM WarehouseEntity w " +
            "LEFT JOIN FETCH w.warehouseDetails wD " +
            "LEFT JOIN FETCH wD.variant " +
            "WHERE w.id = :id")
    Optional<WarehouseEntity> findWarehouseWithDetailsById(@Param("id") Integer warehouseId);

    Optional<WarehouseEntity> findFirstByOrderByIdAsc();
}
