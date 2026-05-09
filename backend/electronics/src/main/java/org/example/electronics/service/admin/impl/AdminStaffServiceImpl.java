package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.staff.AdminCreateStaffRequestDTO;
import org.example.electronics.dto.request.admin.staff.AdminUpdateStaffRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateUserStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminStaffResponseDTO;
import org.example.electronics.entity.RoleEntity;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.mapper.StaffMapper;
import org.example.electronics.repository.RoleRepository;
import org.example.electronics.repository.StaffRepository;
import org.example.electronics.service.admin.AdminStaffService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminStaffServiceImpl implements AdminStaffService {

    private final StaffMapper staffMapper;
    private final StaffRepository staffRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public AdminStaffResponseDTO createStaff(AdminCreateStaffRequestDTO adminCreateStaffRequestDTO) {
        if(staffRepository.existsByUsername(adminCreateStaffRequestDTO.username()) ||
            staffRepository.existsByEmail(adminCreateStaffRequestDTO.email()) ||
            staffRepository.existsByPhoneNumber(adminCreateStaffRequestDTO.phoneNumber())) {

            throw new IllegalArgumentException("Username, email hoặc số điện thoại này đã tồn tại");
        }

        RoleEntity roleEntity = roleRepository.findById(adminCreateStaffRequestDTO.roleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy Chức vụ với ID: " + adminCreateStaffRequestDTO.roleId()
                ));

        StaffEntity newStaffEntity = staffMapper.toNewEntity(adminCreateStaffRequestDTO);
        String newRawPassword = null;

        if (!StringUtils.hasText(adminCreateStaffRequestDTO.password())) {

            newRawPassword = generateRandomPassword();

            newStaffEntity.setHashedPassword(passwordEncoder.encode(newRawPassword));
        }
        else {

            newStaffEntity.setHashedPassword(passwordEncoder.encode(adminCreateStaffRequestDTO.password()));
        }

        newStaffEntity.setRole(roleEntity);

        newStaffEntity = staffRepository.save(newStaffEntity);

        return staffMapper.toAdminResponseDTOWithPassword(newStaffEntity, newRawPassword);
    }

    @Transactional
    @Override
    public AdminStaffResponseDTO updateStaff(Integer staffId, AdminUpdateStaffRequestDTO adminUpdateStaffRequestDTO) {
        if(staffRepository.existsByUsernameAndIdNot(adminUpdateStaffRequestDTO.username(), staffId) ||
             staffRepository.existsByEmailAndIdNot(adminUpdateStaffRequestDTO.email(), staffId) ||
             staffRepository.existsByPhoneNumberAndIdNot(adminUpdateStaffRequestDTO.phoneNumber(), staffId)) {

            throw new IllegalArgumentException("Username, email hoặc số điện thoại này đã bị trùng với một nhân viên khác");
        }

        StaffEntity existingStaffEntity = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy nhân viên với id: " + staffId
                ));

        RoleEntity newRoleEntity = roleRepository.findById(adminUpdateStaffRequestDTO.roleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy Chức vụ với ID: " + adminUpdateStaffRequestDTO.roleId()
                ));

        staffMapper.updateEntityFromRequest(adminUpdateStaffRequestDTO, existingStaffEntity);

        existingStaffEntity.setRole(newRoleEntity);

        return staffMapper.toAdminResponseDTO(existingStaffEntity);
    }

    @Transactional
    @Override
    public AdminStaffResponseDTO updateStatusStaff(Integer staffId, AdminUpdateUserStatusRequestDTO adminUpdateUserStatusRequestDTO) {
        StaffEntity existingStaffEntity = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy nhân viên với id: " + staffId
                ));

        existingStaffEntity.setStatus(adminUpdateUserStatusRequestDTO.status());

        return staffMapper.toAdminResponseDTO(existingStaffEntity);
    }

    @Transactional
    @Override
    public void deleteStaff(Integer staffId) {
        StaffEntity existingStaffEntity = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy nhân viên với id: " + staffId
                ));

        existingStaffEntity.setStatus(UserStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminStaffResponseDTO> getAllStaffs(String keyword, UserStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.ASSIGNED_AT.name();

        Page<StaffEntity> staffEntityPage = staffRepository.findStaffsWithFilter(finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return staffEntityPage.map(staffMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminStaffResponseDTO getStaffById(Integer staffId) {
        StaffEntity existingStaffEntity = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy nhân viên với id: " + staffId
                ));

        return staffMapper.toAdminResponseDTO(existingStaffEntity);
    }

    @Transactional
    @Override
    public String resetPassword(Integer staffId) {
        StaffEntity existingStaffEntity = staffRepository.findById(staffId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy nhân viên với id: " + staffId
                ));

        String newRawPassword = generateRandomPassword();

        String hashedPassword = passwordEncoder.encode(newRawPassword);
        existingStaffEntity.setHashedPassword(hashedPassword);

        return newRawPassword;
    }

    private String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "@" + (int)(Math.random() * 1000);
    }
}
