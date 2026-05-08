package org.example.electronics.repository;

import org.example.electronics.entity.StaffEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<StaffEntity, Integer> {

    long countByRole_Id(Integer roleId);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUsernameAndIdNot(String username, Integer id);
    boolean existsByEmailAndIdNot(String email, Integer id);
    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Integer id);

    Optional<StaffEntity> findByEmail(String email);

    @Query("SELECT s FROM StaffEntity s WHERE 1=1 " +

            "AND (:keyword IS NULL OR ( " +
            "    CAST(s.id AS string) LIKE CONCAT('%', :keyword, '%') " +
            "    OR LOWER(s.username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            ")) " +

            "AND (:status IS NULL OR s.status = :status) " +

            "AND (CAST(:fromDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'ASSIGNED_AT' AND s.assignedAt >= :fromDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND s.updatedAt >= :fromDate) " +
            ") " +

            "AND (CAST(:toDate AS timestamp) IS NULL OR " +
            "    (:dateType = 'ASSIGNED_AT' AND s.assignedAt <= :toDate) OR " +
            "    (:dateType = 'UPDATED_AT' AND s.updatedAt <= :toDate) " +
            ")"
    )
    Page<StaffEntity> findStaffsWithFilter(
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            @Param("dateType") String dateType,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
