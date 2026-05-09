package org.example.electronics.repository;

import org.example.electronics.entity.ProductEntity;
import org.example.electronics.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    boolean existsByNameAndIdNot(String name, Integer id);

    boolean existsBySlugAndIdNot(String slug, Integer id);

    boolean existsByCategoryId(Integer categoryId);

    @Query(value = "SELECT p FROM ProductEntity p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.brand " +
            "WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(p.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(p.slug) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR p.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND p.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND p.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND p.updatedAt <= :toDate) " +
            ")",

            countQuery = "SELECT COUNT(p) FROM ProductEntity p " +
                    "WHERE 1=1 " +
                    "AND (:keyword IS NULL OR ( " +
                    "    CAST(p.id AS string) LIKE CONCAT('%', :keyword, '%') " +
                    "    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(p.slug) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    ")) " +
                    "AND (:status IS NULL OR p.status = :status) " +

                    "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
                    "    (:dateType = 'CREATED_AT' AND p.createdAt >= :fromDate) OR " +
                    "    (:dateType = 'UPDATED_AT' AND p.updatedAt >= :fromDate) " +
                    ") " +

                    "AND (CAST(:toDate AS timestamp) IS NULL OR " +
                    "    (:dateType = 'CREATED_AT' AND p.createdAt <= :toDate) OR " +
                    "    (:dateType = 'UPDATED_AT' AND p.updatedAt <= :toDate) " +
                    ")"
    )
    Page<ProductEntity> findProductsWithFilter(
            @Param("keyword") String keyword,
            @Param("status") ProductStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    @Query("SELECT p FROM ProductEntity p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.variants " +
            "LEFT JOIN FETCH p.media " +
            "WHERE p.id = :id")
    Optional<ProductEntity> findProductWithDetailsById(@Param("id") Integer productId);
}
