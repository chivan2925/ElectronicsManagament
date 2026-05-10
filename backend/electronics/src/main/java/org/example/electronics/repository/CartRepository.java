package org.example.electronics.repository;

import org.example.electronics.entity.cart.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Integer> {

    Optional<CartEntity> findByUser_Id(Integer userId);

    @Query("SELECT c FROM CartEntity c " +
            "LEFT JOIN FETCH c.items i " +
            "LEFT JOIN FETCH i.variant v " +
            "LEFT JOIN FETCH v.product p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.brand " +
            "WHERE c.user.id = :userId")
    List<CartEntity> findByUserIdWithItems(@Param("userId") Integer userId);
}
