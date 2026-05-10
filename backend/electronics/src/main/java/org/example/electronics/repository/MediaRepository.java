package org.example.electronics.repository;

import org.example.electronics.entity.MediaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MediaRepository extends JpaRepository<MediaEntity, Integer> {

    @Modifying
    @Query("UPDATE MediaEntity m SET m.isPrimary = false WHERE m.product.id = :productId")
    void updateIsPrimaryToFalseByProductId(@Param("productId") Integer productId);

    @Modifying
    @Query("UPDATE MediaEntity m SET m.isPrimary = false WHERE m.variant.id = :variantId")
    void updateIsPrimaryToFalseByVariantId(@Param("variantId") Integer variantId);

    @Query(value = "SELECT m FROM MediaEntity m " +
            "LEFT JOIN FETCH m.product p " +
            "LEFT JOIN FETCH m.variant v " +
            "WHERE 1=1 " +
            "AND (:keyword IS NULL OR ( " +
            "    CAST(m.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(m.imageUrl) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(m.publicId) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(v.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +
            "AND (:productId IS NULL OR p.id = :productId) " +
            "AND (:variantId IS NULL OR v.id = :variantId) " +
            "AND (:primary IS NULL OR m.isPrimary = :primary)",
            countQuery = "SELECT COUNT(m) FROM MediaEntity m " +
                    "LEFT JOIN m.product p " +
                    "LEFT JOIN m.variant v " +
                    "WHERE 1=1 " +
                    "AND (:keyword IS NULL OR ( " +
                    "    CAST(m.id AS string) LIKE CONCAT('%', :keyword, '%') " +
                    "    OR LOWER(m.imageUrl) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(m.publicId) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "    OR LOWER(v.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    ")) " +
                    "AND (:productId IS NULL OR p.id = :productId) " +
                    "AND (:variantId IS NULL OR v.id = :variantId) " +
                    "AND (:primary IS NULL OR m.isPrimary = :primary)")
    Page<MediaEntity> findMediaWithFilter(
            @Param("keyword") String keyword,
            @Param("productId") Integer productId,
            @Param("variantId") Integer variantId,
            @Param("primary") Boolean primary,
            Pageable pageable
    );
}
