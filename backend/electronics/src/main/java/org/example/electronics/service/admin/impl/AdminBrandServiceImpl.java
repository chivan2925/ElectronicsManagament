package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminBrandRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminBrandResponseDTO;
import org.example.electronics.entity.BrandEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.mapper.BrandMapper;
import org.example.electronics.repository.BrandRepository;
import org.example.electronics.service.admin.AdminBrandService;
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
public class AdminBrandServiceImpl implements AdminBrandService {

    private final BrandMapper brandMapper;
    private final BrandRepository brandRepository;

    @Transactional
    @Override
    public AdminBrandResponseDTO createBrand(AdminBrandRequestDTO adminBrandRequestDTO) {
        if(brandRepository.existsByName(adminBrandRequestDTO.name())) {
            throw new IllegalArgumentException("Tên thương hiệu đã tồn tại");
        }

        BrandEntity newBrandEntity = brandMapper.toNewEntity(adminBrandRequestDTO);

        newBrandEntity = brandRepository.save(newBrandEntity);

        return brandMapper.toAdminResponseDTO(newBrandEntity);
    }

    @Transactional
    @Override
    public AdminBrandResponseDTO updateBrand(Integer brandId, AdminBrandRequestDTO adminBrandRequestDTO) {
        if(brandRepository.existsByNameAndIdNot(adminBrandRequestDTO.name(), brandId)) {
            throw new IllegalArgumentException("Tên thương hiệu đã bị trùng với một thương hiệu khác");
        }

        BrandEntity existingBrandEntity = brandRepository.findById(brandId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy thương hiệu với id: " + brandId
                ));

        brandMapper.updateEntityFromRequest(adminBrandRequestDTO, existingBrandEntity);

        return brandMapper.toAdminResponseDTO(existingBrandEntity);
    }

    @Transactional
    @Override
    public AdminBrandResponseDTO updateStatusBrand(Integer brandId, AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO) {
        BrandEntity existingBrandEntity = brandRepository.findById(brandId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy thương hiệu với id: " + brandId
                ));

        existingBrandEntity.setStatus(adminUpdateProductStatusRequestDTO.status());

        return brandMapper.toAdminResponseDTO(existingBrandEntity);
    }

    @Transactional
    @Override
    public void deleteBrand(Integer brandId) {
        BrandEntity existingBrandEntity = brandRepository.findById(brandId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy thương hiệu với id: " + brandId
                ));

        existingBrandEntity.setStatus(ProductStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminBrandResponseDTO> getAllBrands(String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<BrandEntity> brandEntityPage = brandRepository.findBrandsWithFilter(finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return brandEntityPage.map(brandMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminBrandResponseDTO getBrandById(Integer brandId) {
        BrandEntity existingBrandEntity = brandRepository.findById(brandId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy thương hiệu với id: " + brandId
                ));

        return brandMapper.toAdminResponseDTO(existingBrandEntity);
    }
}
