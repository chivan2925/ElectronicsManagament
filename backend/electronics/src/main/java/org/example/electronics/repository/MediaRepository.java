package org.example.electronics.repository;

import org.example.electronics.entity.MediaEntity;
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
}
