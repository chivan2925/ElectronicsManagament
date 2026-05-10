package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.auth.CustomerRegisterRequestDTO;
import org.example.electronics.dto.response.user.auth.CustomerRegisterResponseDTO;
import org.example.electronics.service.user.CustomerAuthService;
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
}
