package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.status.AdminUpdateUserStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminUserResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.service.admin.AdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "2. User Management", description = "Các API dành cho Admin để quản lý người dùng")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PatchMapping("/{userId}/status")
    @Operation(
            summary = "Cập nhật trạng thái User",
            description = "Dùng để Khóa (BLOCKED) hoặc Mở khóa (ACTIVE) tài khoản khách hàng."
    )
    public ResponseEntity<AdminUserResponseDTO> updateUserStatus (
            @PathVariable Integer userId,
            @Valid @RequestBody AdminUpdateUserStatusRequestDTO adminUpdateUserStatusRequestDTO
    ) {
        AdminUserResponseDTO adminUserResponseDTO = adminUserService.updateStatusUser(userId, adminUpdateUserStatusRequestDTO);

        return ResponseEntity.ok(adminUserResponseDTO);
    }

    @DeleteMapping("/{userId}")
    @Operation(
            summary = "Xóa User (Soft Delete)",
            description = "Chuyển trạng thái của User thành DELETED."
    )
    public ResponseEntity<Void> deleteUser (
            @PathVariable Integer userId
    ) {
        adminUserService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách User (Có tìm kiếm và lọc)",
            description = "Lấy danh sách người dùng có phân trang. Mặc định sắp xếp ngày tạo mới nhất lên đầu."
    )
    public ResponseEntity<Page<AdminUserResponseDTO>> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminUserResponseDTO> allUsersPage = adminUserService.getAllUsers(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(allUsersPage);
    }

    @GetMapping("/{userId}")
    @Operation(
            summary = "Xem chi tiết 1 User",
            description = "Lấy toàn bộ thông tin công khai của User dựa vào ID."
    )
    public ResponseEntity<AdminUserResponseDTO> getUserById(
            @PathVariable Integer userId
    ) {
        AdminUserResponseDTO adminUserResponseDTO = adminUserService.getUserById(userId);

        return ResponseEntity.ok(adminUserResponseDTO);
    }
}
