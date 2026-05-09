package org.example.electronics.dto.request.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminLoginRequestDTO(
        @Email
        @NotBlank(message = "Email đăng nhập không được để trống")
        String email,

        @NotBlank(message = "Mật khẩu đăng nhập không được để trống")
        String password
) {
}
