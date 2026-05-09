package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminProductRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminReviewResponseDTO;
import org.example.electronics.dto.response.admin.product.AdminDetailProductResponseDTO;
import org.example.electronics.dto.response.admin.product.AdminProductResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.service.admin.AdminProductService;
import org.example.electronics.service.admin.AdminReviewService;
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
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(
        name = "6. Product Management",
        description = "Các API dành cho Admin để quản lý Sản phẩm gốc (Base Product). Nơi định nghĩa 'Linh hồn' và thông số chung của thiết bị."
)
public class AdminProductController {

    private final AdminProductService adminProductService;
    private final AdminReviewService adminReviewService;

    @PostMapping
    @Operation(
            summary = "Tạo mới Sản phẩm",
            description = "Tạo một sản phẩm gốc mới (VD: iPhone 15 Pro Max). Cần truyền vào ID của Danh mục và Thương hiệu."
    )
    public ResponseEntity<AdminProductResponseDTO> createProduct(
            @Valid @RequestBody AdminProductRequestDTO adminProductRequestDTO
    ) {
        AdminProductResponseDTO adminProductResponseDTO = adminProductService.createProduct(adminProductRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminProductResponseDTO);
    }

    @PutMapping("/{productId}")
    @Operation(
            summary = "Cập nhật thông tin Sản phẩm",
            description = "Chỉnh sửa các thông tin chung của sản phẩm (Tên, Slug, Danh mục, Thông số JSON...). Hệ thống sẽ kiểm tra trùng lặp Tên/Slug."
    )
    public ResponseEntity<AdminProductResponseDTO> updateProduct(
            @PathVariable Integer productId,
            @Valid @RequestBody AdminProductRequestDTO adminProductRequestDTO
    ) {
        AdminProductResponseDTO adminProductResponseDTO = adminProductService.updateProduct(productId, adminProductRequestDTO);

        return ResponseEntity.ok(adminProductResponseDTO);
    }

    @PatchMapping("/{productId}/status")
    @Operation(
            summary = "Cập nhật trạng thái Sản phẩm",
            description = "Thay đổi trạng thái của sản phẩm (VD: ACTIVE, INACTIVE). Hỗ trợ ngưng bán tạm thời mà không cần xóa."
    )
    public ResponseEntity<AdminProductResponseDTO> updateStatusProduct(
            @PathVariable Integer productId,
            @Valid @RequestBody AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO
    ) {
        AdminProductResponseDTO adminProductResponseDTO = adminProductService.updateStatusProduct(productId, adminUpdateProductStatusRequestDTO);

        return ResponseEntity.ok(adminProductResponseDTO);
    }

    @DeleteMapping("/{productId}")
    @Operation(
            summary = "Xóa Sản phẩm (Soft Delete)",
            description = "Chuyển trạng thái sản phẩm thành DELETED. CẢNH BÁO: Hệ thống sẽ chặn thao tác xóa nếu sản phẩm này vẫn đang chứa các biến thể (variants)."
    )
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Integer productId
    ) {
        adminProductService.deleteProduct(productId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách Sản phẩm (Có phân trang & Lọc)",
            description = "Truy xuất danh sách sản phẩm. Trả về DTO rút gọn (không kèm danh sách biến thể) để tối ưu hiệu năng. Hỗ trợ tìm kiếm và lọc."
    )
    public ResponseEntity<Page<AdminProductResponseDTO>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminProductResponseDTO> adminProductResponseDTOPage = adminProductService.getAllProducts(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminProductResponseDTOPage);
    }

    @GetMapping("/{productId}")
    @Operation(
            summary = "Xem chi tiết 1 Sản phẩm",
            description = "Lấy toàn bộ thông tin chi tiết của sản phẩm. Trả về DTO Đầy đủ CÓ KÈM THEO danh sách các biến thể (variants) thuộc sản phẩm này."
    )
    public ResponseEntity<AdminDetailProductResponseDTO> getProductById(
            @PathVariable Integer productId
    ) {
        AdminDetailProductResponseDTO adminDetailProductResponseDTO = adminProductService.getProductById(productId);

        return ResponseEntity.ok(adminDetailProductResponseDTO);
    }

    @GetMapping("/{productId}/reviews")
    @Operation(
            summary = "Lấy danh sách Đánh giá của Sản phẩm (Có phân trang & Lọc)",
            description = "Truy xuất danh sách đánh giá của 1 sản phẩm cụ thể. Hỗ trợ phân trang để tránh tràn RAM (Chuẩn Enterprise) và lọc theo từ khóa (ID, Nội dung), khoảng thời gian."
    )
    public ResponseEntity<Page<AdminReviewResponseDTO>> getAllProductReviews(
            @PathVariable Integer productId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminReviewResponseDTO> reviewsPage = adminReviewService.getAllReviewsByProductId(productId, keyword, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(reviewsPage);
    }
}
