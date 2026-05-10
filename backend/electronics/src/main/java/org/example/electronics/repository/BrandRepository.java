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

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Integer id);

    @Query("SELECT b FROM BrandEntity b WHERE 1=1 " +

            "AND (CAST(:keyword AS string) IS NULL OR ( " +
            "    CAST(b.id AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%') " +
            "    OR LOWER(b.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "    OR LOWER(b.slug) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            "    OR LOWER(b.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
            ")) " +

            "AND (CAST(:status AS string) IS NULL OR b.status = :status) " +

            "AND (CAST(:featured AS string) IS NULL OR COALESCE(b.featured, false) = :featured) " +

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
            @Param("featured") Boolean featured,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
