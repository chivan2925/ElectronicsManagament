package org.example.electronics.service.user;

import org.example.electronics.dto.request.user.UserUpdateProfileRequestDTO;
import org.example.electronics.dto.response.admin.AdminUserResponseDTO;

public interface UserProfileService {

    AdminUserResponseDTO getProfile(Integer userId);

    AdminUserResponseDTO updateProfile(Integer userId, UserUpdateProfileRequestDTO requestDTO);
}
