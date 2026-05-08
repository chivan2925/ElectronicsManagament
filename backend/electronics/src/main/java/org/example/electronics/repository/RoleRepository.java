package org.example.electronics.repository;

import org.example.electronics.entity.RoleEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity, Integer> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Integer id);

    @Query("SELECT r FROM RoleEntity r WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(r.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR r.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND r.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND r.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND r.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND r.updatedAt <= :toDate) " +
            ")"
    )
    Page<RoleEntity> findRolesWithFilter(
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    @Query("SELECT r FROM RoleEntity r " +
            "LEFT JOIN FETCH r.permissions " +
            "WHERE r.id = :id")
    Optional<RoleEntity> findRoleWithDetailsById(@Param("id") Integer roleId);
}
