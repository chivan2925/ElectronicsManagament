package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminCouponRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateCouponStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminCouponResponseDTO;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponTimeStatus;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.service.admin.AdminCouponService;
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
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Tag(name = "Admin - Coupon Management", description = "Các API quản lý Mã giảm giá (Coupon) dành cho Admin")
public class AdminCouponController {

    private final AdminCouponService adminCouponService;

    @PostMapping
    @Operation(
            summary = "Tạo mới mã giảm giá",
            description = "Thêm mới một mã giảm giá vào hệ thống. Có thể tạo mã cho toàn sàn (để trống Category/Brand) hoặc mã riêng biệt. Code là duy nhất."
    )
    public ResponseEntity<AdminCouponResponseDTO> createCoupon(
            @Valid @RequestBody AdminCouponRequestDTO adminCouponRequestDTO
    ) {
        AdminCouponResponseDTO adminCouponResponseDTO = adminCouponService.createCoupon(adminCouponRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminCouponResponseDTO);
    }

    @PutMapping("/{couponId}")
    @Operation(
            summary = "Cập nhật thông tin mã giảm giá",
            description = "Chỉnh sửa toàn bộ thông tin của mã giảm giá dựa theo ID. Ngày kết thúc bắt buộc phải lớn hơn ngày bắt đầu."
    )
    public ResponseEntity<AdminCouponResponseDTO> updateCoupon(
            @PathVariable Integer couponId,
            @Valid @RequestBody AdminCouponRequestDTO adminCouponRequestDTO
    ) {
        AdminCouponResponseDTO adminCouponResponseDTO = adminCouponService.updateCoupon(couponId, adminCouponRequestDTO);

        return ResponseEntity.ok(adminCouponResponseDTO);
    }

    @PatchMapping("/{couponId}/status")
    @Operation(
            summary = "Cập nhật trạng thái mã giảm giá",
            description = "Chỉ thay đổi trạng thái của mã giảm giá (VD: VALID, EXPIRED, DELETED) mà không ảnh hưởng đến cấu hình khác."
    )
    public ResponseEntity<AdminCouponResponseDTO> updateStatusCoupon(
            @PathVariable Integer couponId,
            @Valid @RequestBody AdminUpdateCouponStatusRequestDTO adminUpdateCouponStatusRequestDTO
    ) {
        AdminCouponResponseDTO adminCouponResponseDTO = adminCouponService.updateStatusCoupon(couponId, adminUpdateCouponStatusRequestDTO);

        return ResponseEntity.ok(adminCouponResponseDTO);
    }

    @DeleteMapping("/{couponId}")
    @Operation(
            summary = "Xóa mã giảm giá (Soft Delete)",
            description = "Chuyển trạng thái của mã giảm giá sang DELETED. Dữ liệu vẫn được giữ lại dưới Database phục vụ đối soát."
    )
    public ResponseEntity<AdminCouponResponseDTO> deleteCoupon(
            @PathVariable Integer couponId
    ) {
        adminCouponService.deleteCoupon(couponId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách mã giảm giá (Có phân trang)",
            description = "Truy xuất danh sách mã giảm giá. Hỗ trợ phân trang, sắp xếp và lọc theo từ khóa (code), trạng thái, và khoảng thời gian tạo."
    )
    public ResponseEntity<Page<AdminCouponResponseDTO>> getAllCoupons(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) CouponTimeStatus timeStatus,
            @RequestParam(required = false) CouponStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminCouponResponseDTO> adminCouponResponseDTOPage = adminCouponService.getAllCoupons(keyword, timeStatus, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminCouponResponseDTOPage);
    }

    @GetMapping("/{couponId}")
    @Operation(
            summary = "Lấy chi tiết một mã giảm giá",
            description = "Truy xuất toàn bộ thông tin chi tiết của một mã giảm giá cụ thể thông qua ID."
    )
    public ResponseEntity<AdminCouponResponseDTO> getCouponById(
            @PathVariable Integer couponId
    ) {
        AdminCouponResponseDTO adminCouponResponseDTO = adminCouponService.getCouponById(couponId);

        return ResponseEntity.ok(adminCouponResponseDTO);
    }
}
