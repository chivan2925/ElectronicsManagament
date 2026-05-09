package org.example.electronics.repository;

import org.example.electronics.entity.BrandEntity;
import org.example.electronics.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BrandRepository extends JpaRepository<BrandEntity, Integer> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Integer id);

    @Query("SELECT b FROM BrandEntity b WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(b.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR b.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND b.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND b.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND b.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND b.updatedAt <= :toDate) " +
            ")"
    )
    Page<BrandEntity> findBrandsWithFilter(
            @Param("keyword") String keyword,
            @Param("status") ProductStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
