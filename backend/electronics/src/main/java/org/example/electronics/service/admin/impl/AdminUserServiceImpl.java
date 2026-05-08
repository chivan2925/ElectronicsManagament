package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.status.AdminUpdateUserStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminUserResponseDTO;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.mapper.UserMapper;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.service.admin.AdminUserService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public AdminUserResponseDTO updateStatusUser(Integer userId, AdminUpdateUserStatusRequestDTO adminUpdateUserStatusRequestDTO) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy user với id: " + userId
                ));

        userEntity.setStatus(adminUpdateUserStatusRequestDTO.status());

        return userMapper.toAdminResponseDTO(userEntity);
    }

    @Transactional
    @Override
    public void deleteUser(Integer userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy user với id: " + userId
                ));

        userEntity.setStatus(UserStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminUserResponseDTO> getAllUsers(String keyword, UserStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<UserEntity> userEntityPage = userRepository.findUsersWithFilter(finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return userEntityPage.map(userMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminUserResponseDTO getUserById(Integer userId) {
        UserEntity existingUserEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy user với id: " + userId
                ));

        return userMapper.toAdminResponseDTO(existingUserEntity);
    }
}
