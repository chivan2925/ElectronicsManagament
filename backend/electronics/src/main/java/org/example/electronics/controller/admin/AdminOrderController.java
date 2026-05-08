package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.order.AdminUpdateOrderRequestDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderDetailResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderResponseDTO;
import org.example.electronics.entity.enums.*;
import org.example.electronics.security.auth.admin.StaffDetails;
import org.example.electronics.service.admin.AdminOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin - Quản lý đơn hàng", description = "Các API dành cho Admin để tra cứu, lọc và cập nhật trạng thái đơn hàng")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @PatchMapping("/{orderId}")
    @Operation(
            summary = "Cập nhật đơn hàng",
            description = "Cho phép cập nhật thông tin và các trạng thái (Mã vận đơn, Đơn hàng, Thanh toán, Vận chuyển) dựa trên luồng Máy trạng thái (State Machine). Tự động xử lý hoàn số lượng tồn kho nếu đơn bị Hủy hoặc Khách trả hàng."
    )
    public ResponseEntity<AdminOrderResponseDTO> updateOrder(
            @PathVariable Integer orderId,
            @Valid @RequestBody AdminUpdateOrderRequestDTO adminUpdateOrderRequestDTO,
            @AuthenticationPrincipal StaffDetails staffDetails
    ) {
        Integer staffId = staffDetails.getId();

        AdminOrderResponseDTO adminOrderResponseDTO = adminOrderService.updateOrder(orderId, adminUpdateOrderRequestDTO, staffId);

        return ResponseEntity.ok(adminOrderResponseDTO);
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách đơn hàng có phân trang",
            description = "Hiển thị danh sách đơn hàng. Hỗ trợ lọc theo từ khóa (mã đơn, tên khách), trạng thái đơn hàng và khoảng thời gian tạo. Mặc định sắp xếp các đơn có biến động mới nhất lên đầu."
    )
    public ResponseEntity<Page<AdminOrderResponseDTO>> getAllOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentMethodType type,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) ShippingProvider provider,
            @RequestParam(required = false) ShippingStatus shippingStatus,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminOrderResponseDTO> adminOrderResponseDTOPage = adminOrderService.getAllOrders(keyword, status, type, paymentStatus, provider, shippingStatus, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminOrderResponseDTOPage);
    }

    @GetMapping("/{orderId}")
    @Operation(
            summary = "Lấy chi tiết một đơn hàng",
            description = "Tra cứu toàn bộ thông tin chi tiết của một đơn hàng bao gồm thông tin người mua, địa chỉ giao hàng và danh sách các sản phẩm (món hàng) bên trong."
    )
    public ResponseEntity<AdminOrderDetailResponseDTO> getOrderById(
            @PathVariable Integer orderId
    ) {
        AdminOrderDetailResponseDTO adminOrderDetailResponseDTO = adminOrderService.getOrderById(orderId);

        return ResponseEntity.ok(adminOrderDetailResponseDTO);
    }
}
