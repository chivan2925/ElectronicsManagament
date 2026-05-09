package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.UserUpdateProfileRequestDTO;
import org.example.electronics.dto.response.admin.AdminUserResponseDTO;
import org.example.electronics.service.user.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User - Profile", description = "Các API hồ sơ tài khoản cho storefront")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Lấy hồ sơ tài khoản", description = "Trả về thông tin hồ sơ người dùng đang được frontend sử dụng cho khu vực tài khoản.")
    public ResponseEntity<AdminUserResponseDTO> getProfile(
            @PathVariable Integer userId
    ) {
        return ResponseEntity.ok(userProfileService.getProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    @Operation(summary = "Cập nhật hồ sơ tài khoản", description = "Cập nhật thông tin hồ sơ cơ bản của người dùng.")
    public ResponseEntity<AdminUserResponseDTO> updateProfile(
            @PathVariable Integer userId,
            @Valid @RequestBody UserUpdateProfileRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, requestDTO));
    }
}
