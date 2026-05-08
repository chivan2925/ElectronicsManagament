package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminBrandRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminBrandResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.service.admin.AdminBrandService;
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
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
@Tag(name = "Admin - Brand Management", description = "Các API quản lý Thương hiệu dành cho Admin")
public class AdminBrandController {

    private final AdminBrandService adminBrandService;

    @PostMapping
    @Operation(
            summary = "Tạo mới thương hiệu",
            description = "Thêm mới một thương hiệu vào hệ thống. Tên thương hiệu là duy nhất (không được trùng lặp)."
    )
    public ResponseEntity<AdminBrandResponseDTO> createBrand(
            @Valid @RequestBody AdminBrandRequestDTO adminBrandRequestDTO
    ) {
        AdminBrandResponseDTO adminBrandResponseDTO = adminBrandService.createBrand(adminBrandRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminBrandResponseDTO);
    }

    @PutMapping("/{brandId}")
    @Operation(
            summary = "Cập nhật thông tin thương hiệu",
            description = "Chỉnh sửa các thông tin của thương hiệu (Tên, Hình ảnh, Trạng thái) dựa theo ID."
    )
    public ResponseEntity<AdminBrandResponseDTO> updateBrand(
            @PathVariable Integer brandId,
            @Valid @RequestBody AdminBrandRequestDTO adminBrandRequestDTO
    ) {
        AdminBrandResponseDTO adminBrandResponseDTO = adminBrandService.updateBrand(brandId, adminBrandRequestDTO);

        return ResponseEntity.ok(adminBrandResponseDTO);
    }

    @PatchMapping("/{brandId}/status")
    @Operation(
            summary = "Cập nhật nhanh trạng thái thương hiệu",
            description = "Chỉ thay đổi trạng thái của thương hiệu (VD: ACTIVE, INACTIVE, DELETED) mà không ảnh hưởng đến các thông tin khác."
    )
    public ResponseEntity<AdminBrandResponseDTO> updateStatusBrand(
            @PathVariable Integer brandId,
            @Valid @RequestBody AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO
    ) {
        AdminBrandResponseDTO adminBrandResponseDTO = adminBrandService.updateStatusBrand(brandId, adminUpdateProductStatusRequestDTO);

        return ResponseEntity.ok(adminBrandResponseDTO);
    }

    @DeleteMapping("/{brandId}")
    @Operation(
            summary = "Xóa thương hiệu (Soft Delete)",
            description = "Chuyển trạng thái của thương hiệu sang DELETED, không xóa cứng dữ liệu vật lý dưới Database."
    )
    public ResponseEntity<AdminBrandResponseDTO> deleteBrand(
            @PathVariable Integer brandId
    ) {
        adminBrandService.deleteBrand(brandId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách thương hiệu (Có phân trang)",
            description = "Truy xuất danh sách thương hiệu. Hỗ trợ phân trang, sắp xếp và lọc theo từ khóa (tên), trạng thái, và khoảng thời gian tạo."
    )
    public ResponseEntity<Page<AdminBrandResponseDTO>> getAllBrands(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminBrandResponseDTO> adminBrandResponseDTOPage = adminBrandService.getAllBrands(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminBrandResponseDTOPage);
    }

    @GetMapping("/{brandId}")
    @Operation(
            summary = "Lấy chi tiết một thương hiệu",
            description = "Truy xuất toàn bộ thông tin chi tiết của một thương hiệu cụ thể thông qua ID."
    )
    public ResponseEntity<AdminBrandResponseDTO> getBrandById(
            @PathVariable Integer brandId
    ) {
        AdminBrandResponseDTO adminBrandResponseDTO = adminBrandService.getBrandById(brandId);

        return ResponseEntity.ok(adminBrandResponseDTO);
    }
}
