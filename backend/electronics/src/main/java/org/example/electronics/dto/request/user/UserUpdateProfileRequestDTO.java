package org.example.electronics.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.GenderType;

import java.time.LocalDate;

public record UserUpdateProfileRequestDTO(
        @NotBlank(message = "Họ tên không được để trống")
        @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
        String fullName,

        GenderType gender,

        @Past(message = "Ngày sinh phải là ngày trong quá khứ")
        LocalDate dateOfBirth,

        @NotBlank(message = "Username không được để trống")
        @Size(max = 25, message = "Username không được vượt quá 25 ký tự")
        String username,

        String avatarUrl,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotBlank(message = "Số điện thoại không được để trống")
        @Size(max = 16, message = "Số điện thoại không được vượt quá 16 ký tự")
        String phoneNumber
) {
}
