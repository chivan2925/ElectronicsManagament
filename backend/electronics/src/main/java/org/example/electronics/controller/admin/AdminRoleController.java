package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminRoleRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateUserStatusRequestDTO;
import org.example.electronics.dto.response.admin.role.AdminDetailRoleResponseDTO;
import org.example.electronics.dto.response.admin.role.AdminRoleResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.service.admin.AdminRoleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
@Tag(
        name = "3. Role Management",
        description = "Các API dành cho Admin để quản lý Vai trò / Chức vụ của nhân viên"
)
public class AdminRoleController {

    private final AdminRoleService adminRoleService;

    @PostMapping
    @Operation(
            summary = "Tạo mới chức vụ",
            description = "Tạo một chức vụ mới trong hệ thống (VD: Quản lý, Nhân viên kho...). Tên chức vụ phải là duy nhất."
    )
    public ResponseEntity<AdminRoleResponseDTO> createRole(
            @Valid @RequestBody AdminRoleRequestDTO adminRoleRequestDTO
    ) {
        AdminRoleResponseDTO adminRoleResponseDTO = adminRoleService.createRole(adminRoleRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminRoleResponseDTO);
    }

    @PutMapping("/{roleId}")
    @Operation(
            summary = "Cập nhật chức vụ",
            description = "Cập nhật thông tin của chức vụ. Hệ thống sẽ kiểm tra để đảm bảo tên chức vụ không bị trùng lặp."
    )
    public ResponseEntity<AdminRoleResponseDTO> updateRole(
            @PathVariable Integer roleId,
            @Valid @RequestBody AdminRoleRequestDTO adminRoleRequestDTO
    ) {
        AdminRoleResponseDTO adminRoleResponseDTO = adminRoleService.updateRole(roleId, adminRoleRequestDTO);

        return ResponseEntity.ok(adminRoleResponseDTO);
    }

    @PatchMapping("/{roleId}/status")
    @Operation(
            summary = "Cập nhật trạng thái chức vụ",
            description = "Dùng để Khóa (BLOCKED) hoặc Mở khóa (ACTIVE) một chức vụ cụ thể."
    )
    public ResponseEntity<AdminRoleResponseDTO> updateStatusRole(
            @PathVariable Integer roleId,
            @Valid @RequestBody AdminUpdateUserStatusRequestDTO adminUpdateUserStatusRequestDTO
    ) {
        AdminRoleResponseDTO adminRoleResponseDTO = adminRoleService.updateStatusRole(roleId, adminUpdateUserStatusRequestDTO);

        return ResponseEntity.ok(adminRoleResponseDTO);
    }

    @DeleteMapping("/{roleId}")
    @Operation(
            summary = "Xóa chức vụ (Soft Delete)",
            description = "Chuyển trạng thái của chức vụ thành DELETED. API sẽ văng lỗi 400 nếu đang có nhân viên giữ chức vụ này."
    )
    public ResponseEntity<Void> deleteRole(
            @PathVariable Integer roleId
    ) {
        adminRoleService.deleteRole(roleId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách chức vụ (Có tìm kiếm và lọc)",
            description = "Lấy danh sách phân trang các chức vụ. Hỗ trợ tìm kiếm theo tên, lọc theo trạng thái và ngày tạo."
    )
    public ResponseEntity<Page<AdminRoleResponseDTO>> getAllRoles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminRoleResponseDTO> allRolesPage = adminRoleService.getAllRoles(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(allRolesPage);
    }

    @GetMapping("/{roleId}")
    @Operation(
            summary = "Xem chi tiết 1 chức vụ",
            description = "Lấy toàn bộ thông tin của một chức vụ cụ thể dựa vào ID."
    )
    public ResponseEntity<AdminDetailRoleResponseDTO> getRoleById(
            @PathVariable Integer roleId
    ) {
        AdminDetailRoleResponseDTO adminDetailRoleResponseDTO = adminRoleService.getRoleById(roleId);

        return ResponseEntity.ok(adminDetailRoleResponseDTO);
    }
}
