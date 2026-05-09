package org.example.electronics.repository;

import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VariantRepository extends JpaRepository<VariantEntity, Integer> {

    boolean existsByProductId(Integer productId);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    boolean existsByNameAndIdNot(String name, Integer id);

    boolean existsBySlugAndIdNot(String slug, Integer id);

    @Query(value = "SELECT v FROM VariantEntity v " +
            "LEFT JOIN FETCH v.product " +
            "WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(v.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(v.slug) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR v.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND v.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND v.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND v.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND v.updatedAt <= :toDate) " +
            ")",

            countQuery = "SELECT COUNT(v) FROM VariantEntity v " +
                    "WHERE 1=1 " +
                    "AND (:keyword IS NULL OR ( " +
                    "    CAST(v.id AS string) LIKE CONCAT('%', :keyword, '%') " +
                    "    OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(v.slug) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    ")) " +
                    "AND (:status IS NULL OR v.status = :status) " +

                    "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
                    "    (:dateType = 'CREATED_AT' AND v.createdAt >= :fromDate) OR " +
                    "    (:dateType = 'UPDATED_AT' AND v.updatedAt >= :fromDate) " +
                    ") " +

                    "AND (CAST(:toDate AS timestamp) IS NULL OR " +
                    "    (:dateType = 'CREATED_AT' AND v.createdAt <= :toDate) OR " +
                    "    (:dateType = 'UPDATED_AT' AND v.updatedAt <= :toDate) " +
                    ")"
    )
    Page<VariantEntity> findVariantsWithFilter(
            @Param("keyword") String keyword,
            @Param("status") ProductStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    @Query("SELECT v FROM VariantEntity v " +
            "LEFT JOIN FETCH v.product " +
            "LEFT JOIN FETCH v.media " +
            "WHERE v.id = :id")
    Optional<VariantEntity> findVariantWithBasicDetailsById(@Param("id") Integer variantId);

    @Query("SELECT wD FROM WarehouseDetailEntity wD " +
            "JOIN FETCH wD.warehouse " +
            "JOIN FETCH wD.variant " +
            "WHERE wD.variant.id = :variantId AND wD.quantity > 0")
    List<WarehouseDetailEntity> findWarehouseStocksByVariantId(@Param("variantId") Integer variantId);
}
