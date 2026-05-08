package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminCategoryRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.category.AdminCategoryResponseDTO;
import org.example.electronics.dto.response.admin.category.AdminDetailCategoryResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.service.admin.AdminCategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@Tag(name = "1. Category Management", description = "Các API dùng để quản lý Danh mục sản phẩm")
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @PostMapping
    @Operation(
            summary = "Tạo mới danh mục",
            description = "Thêm một danh mục mới (Cha hoặc Con). Để parentId = null nếu tạo danh mục gốc."
    )
    public ResponseEntity<AdminCategoryResponseDTO> createCategory(
            @Valid @RequestBody AdminCategoryRequestDTO adminCategoryRequestDTO
    ) {
        AdminCategoryResponseDTO adminCategoryResponseDTO = adminCategoryService.createCategory(adminCategoryRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminCategoryResponseDTO);
    }

    @PutMapping("/{categoryId}")
    @Operation(
            summary = "Cập nhật danh mục",
            description = "Chỉnh sửa thông tin danh mục hiện có theo ID."
    )
    public ResponseEntity<AdminCategoryResponseDTO> updateCategory(
            @PathVariable Integer categoryId,
            @Valid @RequestBody AdminCategoryRequestDTO adminCategoryRequestDTO
    ) {
        AdminCategoryResponseDTO adminCategoryResponseDTO = adminCategoryService.updateCategory(categoryId, adminCategoryRequestDTO);

        return ResponseEntity.ok(adminCategoryResponseDTO);
    }

    @PatchMapping("/{categoryId}/status")
    @Operation(
            summary = "Cập nhật trạng thái Danh mục",
            description = "Dùng để kích hoạt (ACTIVE) hoặc Ẩn (HIDDEN) một danh mục cụ thể."
    )
    public ResponseEntity<AdminCategoryResponseDTO> updateStatusCategory(
            @PathVariable Integer categoryId,
            @Valid @RequestBody AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO
    ) {
        AdminCategoryResponseDTO adminCategoryResponseDTO = adminCategoryService.updateStatusCategory(categoryId, adminUpdateProductStatusRequestDTO);

        return ResponseEntity.ok(adminCategoryResponseDTO);
    }

    @DeleteMapping("/{categoryId}")
    @Operation(
            summary = "Xóa danh mục (Soft Delete)",
            description = "Chuyển trạng thái danh mục sang DELETED. Sẽ báo lỗi nếu danh mục này đang chứa danh mục con."
    )
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Integer categoryId
    ) {
        adminCategoryService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách danh mục Cha (Có tìm kiếm và lọc)",
            description = "Trả về danh sách danh mục gốc (không có parentId) kèm theo thông tin phân trang."
    )
    public ResponseEntity<Page<AdminCategoryResponseDTO>> getAllParentCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminCategoryResponseDTO> allParentCategoriesPage = adminCategoryService.getAllParentCategories(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(allParentCategoriesPage);
    }

    @GetMapping("/{parentId}/subcategories")
    @Operation(
            summary = "Lấy danh sách danh mục Con (Có tìm kiếm và lọc)",
            description = "Trả về danh sách các danh mục con thuộc về một danh mục cha cụ thể, có phân trang."
    )
    public ResponseEntity<Page<AdminCategoryResponseDTO>> getAllSubCategories(
            @PathVariable Integer parentId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminCategoryResponseDTO> allSubCategoriesPage = adminCategoryService.getAllSubCategories(parentId, keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(allSubCategoriesPage);
    }

    @GetMapping("/{categoryId}")
    @Operation(
            summary = "Lấy chi tiết danh mục",
            description = "Lấy thông tin của 1 danh mục cụ thể dựa vào ID."
    )
    public ResponseEntity<AdminDetailCategoryResponseDTO> getCategoryById(
            @PathVariable Integer categoryId
    ) {
        AdminDetailCategoryResponseDTO adminDetailCategoryResponseDTO = adminCategoryService.getCategoryById(categoryId);

        return ResponseEntity.ok(adminDetailCategoryResponseDTO);
    }
}
