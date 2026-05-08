package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminLoginRequestDTO;
import org.example.electronics.dto.response.admin.AdminLoginResponseDTO;
import org.example.electronics.service.admin.AdminAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@Tag(
        name = "1. Admin Authentication",
        description = "Các API liên quan đến Đăng nhập và Cấp quyền cho Ban quản trị / Nhân viên hệ thống."
)
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    @Operation(
            summary = "Đăng nhập hệ thống Admin",
            description = "Hệ thống sẽ xác thực Email và Mật khẩu. Nếu hợp lệ, trả về JWT Access Token cùng thông tin phân quyền để sử dụng cho các API khác."
    )
    public ResponseEntity<AdminLoginResponseDTO> login(
            @Valid @RequestBody AdminLoginRequestDTO adminLoginRequestDTO
    ) {
        AdminLoginResponseDTO adminLoginResponseDTO = adminAuthService.login(adminLoginRequestDTO);

        return ResponseEntity.ok(adminLoginResponseDTO);
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất Admin", description = "Vô hiệu hóa Token hiện tại bằng cách đưa vào Blacklist.")
    public ResponseEntity<String> logout(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        adminAuthService.logout(authHeader);

        return ResponseEntity.ok("Đăng xuất thành công!");
    }
}
