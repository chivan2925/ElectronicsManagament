package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminPermissionResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.service.admin.AdminPermissionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/permissions")
@RequiredArgsConstructor
@Tag(
        name = "4. Permission Management",
        description = "Các API dành cho Admin để quản lý danh mục Quyền hạn (Lưu ý: Không có API Xóa vì quyền hạn gắn liền với Source Code)"
)
public class AdminPermissionController {

    private final AdminPermissionService adminPermissionService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách quyền hạn (Có phân trang & Lọc)",
            description = "Truy xuất danh sách toàn bộ quyền hạn. Hỗ trợ tìm kiếm theo ID, Code, Tên và lọc theo khoảng thời gian tạo."
    )
    public ResponseEntity<Page<AdminPermissionResponseDTO>> getAllPermissions(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminPermissionResponseDTO> adminPermissionResponseDTOPage = adminPermissionService.getAllPermissions(keyword, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminPermissionResponseDTOPage);
    }

    @GetMapping("/{permissionId}")
    @Operation(
            summary = "Xem chi tiết 1 quyền hạn",
            description = "Lấy toàn bộ thông tin chi tiết của một quyền hạn cụ thể dựa vào ID."
    )
    public ResponseEntity<AdminPermissionResponseDTO> getPermissionById(
            @PathVariable Integer permissionId
    ) {
        AdminPermissionResponseDTO adminPermissionResponseDTO = adminPermissionService.getPermissionById(permissionId);

        return ResponseEntity.ok(adminPermissionResponseDTO);
    }
}
