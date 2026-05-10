package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.cart.CartItemQuantityRequestDTO;
import org.example.electronics.dto.request.user.cart.CartItemRequestDTO;
import org.example.electronics.dto.request.user.cart.CartSyncRequestDTO;
import org.example.electronics.dto.response.user.cart.CartResponseDTO;
import org.example.electronics.security.auth.user.CustomerDetails;
import org.example.electronics.service.user.UserCartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "User - Cart", description = "Các API lưu và đồng bộ giỏ hàng storefront")
public class UserCartController {

    private final UserCartService userCartService;

    @GetMapping
    @Operation(summary = "Lấy giỏ hàng hiện tại của khách hàng")
    public ResponseEntity<CartResponseDTO> getCart(
            @AuthenticationPrincipal CustomerDetails customerDetails
    ) {
        return ResponseEntity.ok(userCartService.getCart(getCustomerId(customerDetails)));
    }

    @PutMapping
    @Operation(summary = "Thay thế giỏ hàng bằng danh sách item mới")
    public ResponseEntity<CartResponseDTO> replaceCart(
            @AuthenticationPrincipal CustomerDetails customerDetails,
            @Valid @RequestBody CartSyncRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(userCartService.replaceCart(getCustomerId(customerDetails), requestDTO));
    }

    @PostMapping("/items")
    @Operation(summary = "Thêm sản phẩm vào giỏ hàng")
    public ResponseEntity<CartResponseDTO> addItem(
            @AuthenticationPrincipal CustomerDetails customerDetails,
            @Valid @RequestBody CartItemRequestDTO requestDTO
    ) {
        CartResponseDTO responseDTO = userCartService.addItem(getCustomerId(customerDetails), requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PatchMapping("/items/{variantId}")
    @Operation(summary = "Cập nhật số lượng một sản phẩm trong giỏ hàng")
    public ResponseEntity<CartResponseDTO> updateItem(
            @AuthenticationPrincipal CustomerDetails customerDetails,
            @PathVariable Integer variantId,
            @Valid @RequestBody CartItemQuantityRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(userCartService.updateItem(getCustomerId(customerDetails), variantId, requestDTO));
    }

    @DeleteMapping("/items/{variantId}")
    @Operation(summary = "Xóa một sản phẩm khỏi giỏ hàng")
    public ResponseEntity<CartResponseDTO> removeItem(
            @AuthenticationPrincipal CustomerDetails customerDetails,
            @PathVariable Integer variantId
    ) {
        return ResponseEntity.ok(userCartService.removeItem(getCustomerId(customerDetails), variantId));
    }

    @DeleteMapping
    @Operation(summary = "Xóa toàn bộ giỏ hàng")
    public ResponseEntity<CartResponseDTO> clearCart(
            @AuthenticationPrincipal CustomerDetails customerDetails
    ) {
        return ResponseEntity.ok(userCartService.clearCart(getCustomerId(customerDetails)));
    }

    private Integer getCustomerId(CustomerDetails customerDetails) {
        if (customerDetails == null) {
            throw new AccessDeniedException("Yêu cầu đăng nhập khách hàng để sử dụng giỏ hàng");
        }

        return customerDetails.getId();
    }
}
