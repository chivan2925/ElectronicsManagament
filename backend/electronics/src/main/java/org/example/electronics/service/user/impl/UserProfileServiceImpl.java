package org.example.electronics.service.user.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.UserUpdateProfileRequestDTO;
import org.example.electronics.dto.response.admin.AdminUserResponseDTO;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.mapper.UserMapper;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.service.user.UserProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @Override
    public AdminUserResponseDTO getProfile(Integer userId) {
        return userMapper.toAdminResponseDTO(findVisibleUser(userId));
    }

    @Transactional
    @Override
    public AdminUserResponseDTO updateProfile(Integer userId, UserUpdateProfileRequestDTO requestDTO) {
        UserEntity user = findVisibleUser(userId);
        String username = requestDTO.username().trim();
        String email = requestDTO.email().trim().toLowerCase();
        String phoneNumber = normalizePhone(requestDTO.phoneNumber());

        if (userRepository.existsByUsernameIgnoreCaseAndIdNot(username, userId)) {
            throw new IllegalArgumentException("Username này đã được sử dụng");
        }

        if (userRepository.existsByEmailIgnoreCaseAndIdNot(email, userId)) {
            throw new IllegalArgumentException("Email này đã được sử dụng");
        }

        if (userRepository.existsByPhoneNumberAndIdNot(phoneNumber, userId)) {
            throw new IllegalArgumentException("Số điện thoại này đã được sử dụng");
        }

        user.setFullName(requestDTO.fullName().trim());
        user.setGender(requestDTO.gender() == null ? user.getGender() : requestDTO.gender());
        user.setDateOfBirth(requestDTO.dateOfBirth());
        user.setUsername(username);
        user.setAvatarUrl(normalizeOptionalText(requestDTO.avatarUrl()));
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);

        return userMapper.toAdminResponseDTO(user);
    }

    private UserEntity findVisibleUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));

        if (user.getStatus() == UserStatus.DELETED) {
            throw new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId);
        }

        return user;
    }

    private String normalizeOptionalText(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String normalizePhone(String phone) {
        String digits = phone == null ? "" : phone.replaceAll("[^0-9]", "");

        if (digits.startsWith("84") && digits.length() == 11) {
            digits = "0" + digits.substring(2);
        }

        if (digits.length() != 10) {
            throw new IllegalArgumentException("Số điện thoại cần có 10 chữ số");
        }

        return digits;
    }
}
