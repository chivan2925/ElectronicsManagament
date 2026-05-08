package org.example.electronics.repository;

import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    @Query("SELECT u FROM UserEntity u WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(u.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(u.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR u.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND u.createdAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND u.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'CREATED_AT' AND u.createdAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND u.updatedAt <= :toDate) " +
            ")"
    )
    Page<UserEntity> findUsersWithFilter(
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
