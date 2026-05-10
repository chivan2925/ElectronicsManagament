package org.example.electronics.dto.request.user.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerRegisterRequestDTO(

        @NotBlank(message = "Họ tên không được để trống")
        @Size(min = 2, max = 100, message = "Họ tên phải có từ 2 đến 100 ký tự")
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @Size(max = 16, message = "Số điện thoại không được vượt quá 16 ký tự")
        String phone,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 8, max = 72, message = "Mật khẩu phải có từ 8 đến 72 ký tự")
        String password,

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        @Size(min = 8, max = 72, message = "Xác nhận mật khẩu phải có từ 8 đến 72 ký tự")
        String confirmPassword
) {
}
