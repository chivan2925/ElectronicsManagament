package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.request.admin.AdminVariantRequestDTO;
import org.example.electronics.dto.response.admin.variant.AdminDetailVariantResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.service.admin.AdminVariantService;
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
@RequestMapping("/api/admin/variants")
@RequiredArgsConstructor
@Tag(
        name = "7. Variant Management",
        description = "Các API dành cho Admin để quản lý Biến thể sản phẩm (Variant). Nơi quản lý 'Thể xác' như Màu sắc, RAM, ROM, Giá tiền và Tồn kho."
)
public class AdminVariantController {

    private final AdminVariantService adminVariantService;

    @PostMapping
    @Operation(
            summary = "Tạo mới Biến thể",
            description = "Tạo một biến thể mới cho sản phẩm gốc (VD: Bản 256GB - Màu Đen). Bắt buộc phải truyền vào tham số productId hợp lệ để hệ thống biết biến thể này thuộc về sản phẩm nào."
    )
    public ResponseEntity<AdminVariantResponseDTO> createVariant(
            @Valid @RequestBody AdminVariantRequestDTO adminVariantRequestDTO
    ) {
        AdminVariantResponseDTO adminVariantResponseDTO = adminVariantService.createVariant(adminVariantRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminVariantResponseDTO);
    }

    @PutMapping("/{variantId}")
    @Operation(
            summary = "Cập nhật Biến thể",
            description = "Chỉnh sửa thông số của biến thể (Giá tiền, Số lượng tồn kho, Màu sắc, Specs JSON...). Hệ thống sẽ tự động kiểm tra tính hợp lệ của dữ liệu."
    )
    public ResponseEntity<AdminVariantResponseDTO> updateVariant(
            @PathVariable Integer variantId,
            @Valid @RequestBody AdminVariantRequestDTO adminVariantRequestDTO
    ) {
        AdminVariantResponseDTO adminVariantResponseDTO = adminVariantService.updateVariant(variantId, adminVariantRequestDTO);

        return ResponseEntity.ok(adminVariantResponseDTO);
    }

    @PatchMapping("/{variantId}/status")
    @Operation(
            summary = "Cập nhật trạng thái Biến thể",
            description = "Thay đổi trạng thái biến thể (VD: ACTIVE, INACTIVE). Dùng để ẩn/hiện một phiên bản cụ thể (ví dụ: tạm ngưng bán bản Màu Hồng) mà không ảnh hưởng tới các phiên bản màu khác."
    )
    public ResponseEntity<AdminVariantResponseDTO> updateStatusVariant(
            @PathVariable Integer variantId,
            @Valid @RequestBody AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO
    ) {
        AdminVariantResponseDTO adminVariantResponseDTO = adminVariantService.updateStatusVariant(variantId, adminUpdateProductStatusRequestDTO);

        return ResponseEntity.ok(adminVariantResponseDTO);
    }

    @DeleteMapping("/{variantId}")
    @Operation(
            summary = "Xóa Biến thể (Soft Delete)",
            description = "Chuyển trạng thái biến thể thành DELETED. Khách hàng sẽ không còn nhìn thấy phiên bản này trên giao diện mua hàng."
    )
    public ResponseEntity<Void> deleteVariant(
            @PathVariable Integer variantId
    ) {
        adminVariantService.deleteVariant(variantId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách Biến thể (Có phân trang & Lọc)",
            description = "Truy xuất danh sách tất cả các biến thể trên hệ thống. Hỗ trợ tìm kiếm theo tên, lọc theo trạng thái và khoảng thời gian tạo."
    )
    public ResponseEntity<Page<AdminVariantResponseDTO>> getAllVariants(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminVariantResponseDTO> adminVariantResponseDTOPage = adminVariantService.getAllVariants(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminVariantResponseDTOPage);
    }

    @GetMapping("/{variantId}")
    @Operation(
            summary = "Xem chi tiết 1 Biến thể",
            description = "Lấy toàn bộ thông tin chi tiết của một biến thể cụ thể (kèm thông số JSON, giá thực tế, tồn kho hiện tại)."
    )
    public ResponseEntity<AdminDetailVariantResponseDTO> getVariantById(
            @PathVariable Integer variantId
    ) {
        AdminDetailVariantResponseDTO adminDetailVariantResponseDTO = adminVariantService.getVariantById(variantId);

        return ResponseEntity.ok(adminDetailVariantResponseDTO);
    }
}
