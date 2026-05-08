package org.example.electronics.dto.request.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.UserStatus;

import java.util.Set;

public record AdminRoleRequestDTO(
        @NotBlank(message = "Tên chức vụ không được để trống")
        String name,

        @NotEmpty(message = "Chức vụ phải có ít nhất 1 quyền")
        Set<Integer> permissionIds,

        @NotNull(message = "Trạng thái chức vụ không được null")
        UserStatus status
) {
}
