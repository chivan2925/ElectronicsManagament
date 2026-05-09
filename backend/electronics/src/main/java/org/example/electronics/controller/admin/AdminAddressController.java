package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminAddressResponseDTO;
import org.example.electronics.service.admin.AdminAddressService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(
        name = "Admin - User Address Management",
        description = "Các API dành cho Admin để xem và quản lý địa chỉ của khách hàng"
)
public class AdminAddressController {

    private final AdminAddressService adminAddressService;

    @GetMapping("/{userId}/addresses")
    @Operation(
            summary = "Lấy danh sách địa chỉ của 1 User",
            description = "Truyền vào ID của User để lấy toàn bộ danh sách địa chỉ của họ. Dữ liệu trả về có phân trang và mặc định sắp xếp theo ngày tạo mới nhất (giảm dần)."
    )
    public ResponseEntity<Page<AdminAddressResponseDTO>> getAllAddressesByUserId (
            @PathVariable Integer userId,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminAddressResponseDTO> allAddressesPage = adminAddressService.getAllAddressesByUserId(userId, pageable);

        return ResponseEntity.ok(allAddressesPage);
    }
}
