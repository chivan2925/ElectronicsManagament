package org.example.electronics.service.admin;

import org.example.electronics.dto.response.admin.AdminPermissionResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminPermissionService {

    Page<AdminPermissionResponseDTO> getAllPermissions(String keyword, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminPermissionResponseDTO getPermissionById(Integer permissionId);
}
