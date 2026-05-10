package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.auth.CustomerLoginRequestDTO;
import org.example.electronics.dto.request.user.auth.CustomerRegisterRequestDTO;
import org.example.electronics.dto.response.user.auth.CustomerLoginResponseDTO;
import org.example.electronics.dto.response.user.auth.CustomerRegisterResponseDTO;
import org.example.electronics.service.user.CustomerAuthService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Customer - Auth", description = "Public customer authentication APIs for storefront accounts")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    @PostMapping("/login")
    @Operation(
            summary = "Đăng nhập tài khoản khách hàng",
            description = "Xác thực tài khoản khách hàng trong bảng users và trả về JWT customer token."
    )
    public ResponseEntity<CustomerLoginResponseDTO> login(
            @Valid @RequestBody CustomerLoginRequestDTO requestDTO
    ) {
        CustomerLoginResponseDTO responseDTO = customerAuthService.login(requestDTO);

        return sensitiveResponse().body(responseDTO);
    }

    @PostMapping("/register")
    @Operation(
            summary = "Đăng ký tài khoản khách hàng",
            description = "Tạo tài khoản khách hàng ACTIVE với role USER mặc định. Không cho phép client tự chọn role ADMIN hoặc STAFF."
    )
    public ResponseEntity<CustomerRegisterResponseDTO> register(
            @Valid @RequestBody CustomerRegisterRequestDTO requestDTO
    ) {
        CustomerRegisterResponseDTO responseDTO = customerAuthService.register(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất khách hàng", description = "Vô hiệu hóa customer token hiện tại bằng token blacklist.")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        customerAuthService.logout(request.getHeader("Authorization"));

        return sensitiveResponse().body("Đăng xuất thành công!");
    }

    private ResponseEntity.BodyBuilder sensitiveResponse() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.PRAGMA, "no-cache");
    }
}
