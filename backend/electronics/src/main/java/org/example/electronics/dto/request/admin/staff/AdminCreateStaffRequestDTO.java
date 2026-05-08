package org.example.electronics.dto.request.admin.staff;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.example.electronics.entity.enums.GenderType;
import org.example.electronics.entity.enums.UserStatus;

import java.time.LocalDate;

public record AdminCreateStaffRequestDTO(
        @NotBlank(message = "Họ tên đầy đủ nhân viên không được để trống")
        String fullName,

        @NotNull(message = "Giới tính nhân viên không được null")
        GenderType gender,

        @NotNull(message = "Ngày sinh nhân viên không được null")
        LocalDate dateOfBirth,

        @NotBlank(message = "Username nhân viên không được để trống")
        String username,

        String avatarUrl,

        @Email
        @NotBlank(message = "Email nhân viên không được để trống")
        String email,

        @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại nhân viên phải có 10 chữ số từ 0-9")
        @NotBlank(message = "Số điện thoại nhân viên không được để trống")
        String phoneNumber,

        @NotBlank(message = "Địa chỉ nhân viên không được để trống")
        String address,

        @NotNull(message = "Chức vụ nhân viên không được null")
        Integer roleId,

        String password,

        @NotNull(message = "Trạng thái nhân viên không được null")
        UserStatus status
) {
}
