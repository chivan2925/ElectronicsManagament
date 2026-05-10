package org.example.electronics.dto.request.user.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CustomerLoginRequestDTO(

        @NotBlank(message = "Email đăng nhập không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotBlank(message = "Mật khẩu đăng nhập không được để trống")
        String password
) {
}
