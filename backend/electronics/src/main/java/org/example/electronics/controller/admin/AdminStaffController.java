package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.staff.AdminCreateStaffRequestDTO;
import org.example.electronics.dto.request.admin.staff.AdminUpdateStaffRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateUserStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminStaffResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.service.admin.AdminStaffService;
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
@RequestMapping("/api/admin/staffs")
@RequiredArgsConstructor
@Tag(
        name = "5. Staff Management",
        description = "Các API dành cho Admin để quản lý tài khoản Nhân viên (Staff), phân quyền và theo dõi trạng thái hoạt động."
)
public class AdminStaffController {

    private final AdminStaffService adminStaffService;

    @PostMapping
    @Operation(
            summary = "Tạo mới tài khoản Nhân viên",
            description = "Thêm một nhân viên mới vào hệ thống. Cần truyền vào đầy đủ thông tin cá nhân và ID của Chức vụ (Role) tương ứng."
    )
    public ResponseEntity<AdminStaffResponseDTO> createStaff(
            @Valid @RequestBody AdminCreateStaffRequestDTO adminCreateStaffRequestDTO
    ) {
        AdminStaffResponseDTO adminStaffResponseDTO = adminStaffService.createStaff(adminCreateStaffRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminStaffResponseDTO);
    }

    @PutMapping("/{staffId}")
    @Operation(
            summary = "Cập nhật thông tin Nhân viên",
            description = "Cập nhật lại thông tin cá nhân hoặc chuyển đổi Chức vụ (Role) của nhân viên."
    )
    public ResponseEntity<AdminStaffResponseDTO> updateStaff(
            @PathVariable Integer staffId,
            @Valid @RequestBody AdminUpdateStaffRequestDTO adminUpdateStaffRequestDTO
    ) {
        AdminStaffResponseDTO adminStaffResponseDTO = adminStaffService.updateStaff(staffId, adminUpdateStaffRequestDTO);

        return ResponseEntity.ok(adminStaffResponseDTO);
    }

    @PatchMapping("/{staffId}/status")
    @Operation(
            summary = "Khóa/Mở khóa Nhân viên",
            description = "Thay đổi trạng thái (ACTIVE / BLOCKED) của tài khoản nhân viên. Nhân viên bị khóa sẽ không thể đăng nhập vào hệ thống Admin."
    )
    public ResponseEntity<AdminStaffResponseDTO> updateStatusStaff(
            @PathVariable Integer staffId,
            @Valid @RequestBody AdminUpdateUserStatusRequestDTO adminUpdateUserStatusRequestDTO
    ) {
        AdminStaffResponseDTO adminStaffResponseDTO = adminStaffService.updateStatusStaff(staffId, adminUpdateUserStatusRequestDTO);

        return ResponseEntity.ok(adminStaffResponseDTO);
    }

    @DeleteMapping("/{staffId}")
    @Operation(
            summary = "Xóa tài khoản Nhân viên (Soft Delete)",
            description = "Chuyển trạng thái của nhân viên thành DELETED. Dữ liệu vẫn được giữ lại để đảm bảo tính toàn vẹn của các hóa đơn cũ."
    )
    public ResponseEntity<Void> deleteStaff(
            @PathVariable Integer staffId
    ) {
        adminStaffService.deleteStaff(staffId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách Nhân viên (Có phân trang & Lọc)",
            description = "Truy xuất danh sách nhân viên. Có thể tìm kiếm theo Tên, Username, Email, Số điện thoại và lọc theo trạng thái, khoảng thời gian gia nhập."
    )
    public ResponseEntity<Page<AdminStaffResponseDTO>> getAllStaffs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "ASSIGNED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminStaffResponseDTO> adminStaffResponseDTOPage = adminStaffService.getAllStaffs(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminStaffResponseDTOPage);
    }

    @GetMapping("/{staffId}")
    @Operation(
            summary = "Xem chi tiết 1 Nhân viên",
            description = "Lấy toàn bộ thông tin chi tiết của một tài khoản nhân viên cụ thể thông qua ID."
    )
    public ResponseEntity<AdminStaffResponseDTO> getStaffById(
            @PathVariable Integer staffId
    ) {
        AdminStaffResponseDTO adminStaffResponseDTO = adminStaffService.getStaffById(staffId);

        return ResponseEntity.ok(adminStaffResponseDTO);
    }

    @PostMapping("/{staffId}/reset-password")
    @Operation(
            summary = "Khởi tạo lại mật khẩu cho nhân viên (Reset Password)",
            description = "Admin sử dụng API này khi nhân viên quên mật khẩu. Hệ thống sẽ tự động sinh ra một mật khẩu ngẫu nhiên mới, mã hóa và lưu vào Database. Kết quả trả về là mật khẩu thô (Plain text) để Admin copy và gửi cho nhân viên đó."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reset mật khẩu thành công. Trả về mật khẩu thô."),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy nhân viên với ID tương ứng.")
    })
    public ResponseEntity<String> resetPassword(
            @PathVariable Integer staffId
    ) {
        String defaultRawPassword = adminStaffService.resetPassword(staffId);

        return ResponseEntity.ok(defaultRawPassword);
    }
}
