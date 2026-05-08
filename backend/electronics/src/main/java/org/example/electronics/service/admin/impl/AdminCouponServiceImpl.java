package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminCouponRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateCouponStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminCouponResponseDTO;
import org.example.electronics.entity.BrandEntity;
import org.example.electronics.entity.CategoryEntity;
import org.example.electronics.entity.CouponEntity;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponTimeStatus;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.mapper.CouponMapper;
import org.example.electronics.repository.BrandRepository;
import org.example.electronics.repository.CategoryRepository;
import org.example.electronics.repository.CouponRepository;
import org.example.electronics.service.admin.AdminCouponService;
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
public class AdminCouponServiceImpl implements AdminCouponService {

    private final CouponMapper couponMapper;
    private final CouponRepository couponRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional
    @Override
    public AdminCouponResponseDTO createCoupon(AdminCouponRequestDTO adminCouponRequestDTO) {
        if(couponRepository.existsByCode(adminCouponRequestDTO.code())) {
            throw new IllegalArgumentException("Code của coupon đã tồn tại");
        }

        if (adminCouponRequestDTO.startDate().isAfter(adminCouponRequestDTO.endDate()) ||
                adminCouponRequestDTO.startDate().isEqual(adminCouponRequestDTO.endDate())) {
            throw new IllegalArgumentException("Ngày kết thúc phải diễn ra sau ngày bắt đầu.");
        }

        CouponEntity newCouponEntity = couponMapper.toNewEntity(adminCouponRequestDTO);

        assignCategoryAndBrand(newCouponEntity, adminCouponRequestDTO.categoryId(), adminCouponRequestDTO.brandId());

        newCouponEntity = couponRepository.save(newCouponEntity);

        return couponMapper.toAdminResponseDTO(newCouponEntity);
    }

    @Transactional
    @Override
    public AdminCouponResponseDTO updateCoupon(Integer couponId, AdminCouponRequestDTO adminCouponRequestDTO) {
        if(couponRepository.existsByCodeAndIdNot(adminCouponRequestDTO.code(), couponId)) {
            throw new IllegalArgumentException("Code của coupon đã bị trùng với một coupon khác");
        }

        if (adminCouponRequestDTO.startDate().isAfter(adminCouponRequestDTO.endDate()) ||
                adminCouponRequestDTO.startDate().isEqual(adminCouponRequestDTO.endDate())) {
            throw new IllegalArgumentException("Ngày kết thúc phải diễn ra sau ngày bắt đầu.");
        }

        CouponEntity existingCouponEntity = couponRepository.findById(couponId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy coupon với id: " + couponId
                ));

        assignCategoryAndBrand(existingCouponEntity, adminCouponRequestDTO.categoryId(), adminCouponRequestDTO.brandId());

        couponMapper.updateEntityFromRequest(adminCouponRequestDTO, existingCouponEntity);

        return couponMapper.toAdminResponseDTO(existingCouponEntity);
    }

    @Transactional
    @Override
    public AdminCouponResponseDTO updateStatusCoupon(Integer couponId, AdminUpdateCouponStatusRequestDTO adminUpdateCouponStatusRequestDTO) {
        CouponEntity existingCouponEntity = couponRepository.findById(couponId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy coupon với id: " + couponId
                ));

        existingCouponEntity.setStatus(adminUpdateCouponStatusRequestDTO.status());

        return couponMapper.toAdminResponseDTO(existingCouponEntity);
    }

    @Transactional
    @Override
    public void deleteCoupon(Integer couponId) {
        CouponEntity existingCouponEntity = couponRepository.findById(couponId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy coupon với id: " + couponId
                ));

        existingCouponEntity.setStatus(CouponStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminCouponResponseDTO> getAllCoupons(String keyword, CouponTimeStatus timeStatus, CouponStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<CouponEntity> couponEntityPage = couponRepository.findCouponsWithFilter(finalKeyword, timeStatus, status, typeString, startDateTime, endDateTime, pageable);

        return couponEntityPage.map(couponMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminCouponResponseDTO getCouponById(Integer couponId) {
        CouponEntity existingCouponEntity = couponRepository.findById(couponId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy coupon với id: " + couponId
                ));

        return couponMapper.toAdminResponseDTO(existingCouponEntity);
    }

    private void assignCategoryAndBrand(CouponEntity couponEntity, Integer categoryId, Integer brandId) {
        if (categoryId != null) {
            CategoryEntity category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy danh mục với id: " + categoryId
                    ));
            couponEntity.setCategory(category);
        } else {
            couponEntity.setCategory(null);
        }

        if (brandId != null) {
            BrandEntity brand = brandRepository.findById(brandId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy thương hiệu với id: " + brandId
                    ));
            couponEntity.setBrand(brand);
        } else {
            couponEntity.setBrand(null);
        }
    }
}
