package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminPermissionResponseDTO;
import org.example.electronics.entity.PermissionEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.mapper.PermissionMapper;
import org.example.electronics.repository.PermissionRepository;
import org.example.electronics.service.admin.AdminPermissionService;
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
public class AdminPermissionServiceImpl implements AdminPermissionService {

    private final PermissionMapper permissionMapper;
    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    @Override
    public Page<AdminPermissionResponseDTO> getAllPermissions(String keyword, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<PermissionEntity> permissionEntityPage = permissionRepository.findPermissionsWithFilter(finalKeyword, typeString, startDateTime, endDateTime, pageable);

        return permissionEntityPage.map(permissionMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminPermissionResponseDTO getPermissionById(Integer permissionId) {
        PermissionEntity existingPermissionEntity = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy quyền hạn với id: " + permissionId
                ));

        return permissionMapper.toAdminResponseDTO(existingPermissionEntity);
    }
}
