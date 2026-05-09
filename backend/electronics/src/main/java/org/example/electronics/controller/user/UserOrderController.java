package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.order.UserCreateOrderRequestDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderDetailResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderResponseDTO;
import org.example.electronics.service.user.UserOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "User - Orders", description = "Các API đơn hàng cho luồng checkout storefront")
public class UserOrderController {

    private final UserOrderService userOrderService;

    @GetMapping
    @Operation(
            summary = "Lấy lịch sử đơn hàng của người dùng",
            description = "Trả về danh sách đơn hàng của một người dùng để hiển thị trong khu vực tài khoản storefront."
    )
    public ResponseEntity<Page<AdminOrderResponseDTO>> getOrdersByUserId(
            @RequestParam Integer userId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminOrderResponseDTO> responseDTOPage = userOrderService.getOrdersByUserId(userId, pageable);

        return ResponseEntity.ok(responseDTOPage);
    }

    @GetMapping("/{orderId}")
    @Operation(
            summary = "Lấy chi tiết đơn hàng của người dùng",
            description = "Tra cứu chi tiết một đơn hàng thuộc về người dùng để hiển thị trong account area."
    )
    public ResponseEntity<AdminOrderDetailResponseDTO> getOrderByIdForUser(
            @PathVariable Integer orderId,
            @RequestParam Integer userId
    ) {
        AdminOrderDetailResponseDTO responseDTO = userOrderService.getOrderByIdForUser(userId, orderId);

        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    @Operation(
            summary = "Tạo đơn hàng từ checkout",
            description = "Tạo đơn hàng PENDING, áp dụng coupon hợp lệ nếu có, và giữ tồn kho. Không tạo link thanh toán ở bước này."
    )
    public ResponseEntity<AdminOrderDetailResponseDTO> createOrder(
            @Valid @RequestBody UserCreateOrderRequestDTO requestDTO
    ) {
        AdminOrderDetailResponseDTO responseDTO = userOrderService.createOrder(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
}
