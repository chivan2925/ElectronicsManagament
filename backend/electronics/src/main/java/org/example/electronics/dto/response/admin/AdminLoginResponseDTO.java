package org.example.electronics.dto.response.admin;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Objects;

public record AdminLoginResponseDTO(

        @Schema(description = "Chuỗi JWT Token dùng để xác thực các request tiếp theo")
        String accessToken,

        @Schema(description = "Loại token (Thường là Bearer)", example = "Bearer")
        String tokenType,

        Integer staffId,

        String fullName,

        String email,

        String role
) {
        public AdminLoginResponseDTO {
                Objects.requireNonNull(accessToken, "Lỗi: AccessToken không được null khi trả về Frontend");
                Objects.requireNonNull(staffId, "Lỗi: Staff ID không được null khi trả về Frontend");
                Objects.requireNonNull(fullName, "Lỗi: Full Name không được null khi trả về Frontend");
                Objects.requireNonNull(email, "Lỗi: Email không được null khi trả về Frontend");
                Objects.requireNonNull(role, "Lỗi: Role không được null khi trả về Frontend");
        }
        public AdminLoginResponseDTO(String accessToken, Integer staffId, String fullName, String email, String role) {
                this(accessToken, "Bearer", staffId, fullName, email, role);
        }
}
