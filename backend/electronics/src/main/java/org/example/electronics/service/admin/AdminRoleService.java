package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.AdminRoleRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateUserStatusRequestDTO;
import org.example.electronics.dto.response.admin.role.AdminDetailRoleResponseDTO;
import org.example.electronics.dto.response.admin.role.AdminRoleResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminRoleService {

    AdminRoleResponseDTO createRole(AdminRoleRequestDTO adminRoleRequestDTO);
    AdminRoleResponseDTO updateRole(Integer roleId, AdminRoleRequestDTO adminRoleRequestDTO);
    AdminRoleResponseDTO updateStatusRole(Integer roleId, AdminUpdateUserStatusRequestDTO adminUpdateUserStatusRequestDTO);
    void deleteRole(Integer roleId);
    Page<AdminRoleResponseDTO> getAllRoles(String keyword, UserStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminDetailRoleResponseDTO getRoleById(Integer roleId);
}
