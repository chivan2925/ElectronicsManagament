package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.AdminCategoryRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.category.AdminCategoryResponseDTO;
import org.example.electronics.dto.response.admin.category.AdminDetailCategoryResponseDTO;
import org.example.electronics.entity.CategoryEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.mapper.CategoryMapper;
import org.example.electronics.repository.CategoryRepository;
import org.example.electronics.repository.ProductRepository;
import org.example.electronics.service.admin.AdminCategoryService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminCategoryServiceImpl implements AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ProductRepository productRepository;

    @Transactional
    @Override
    public AdminCategoryResponseDTO createCategory(AdminCategoryRequestDTO adminCategoryRequestDTO) {
        if(categoryRepository.existsBySlug(adminCategoryRequestDTO.slug())) {
            throw new IllegalArgumentException("Slug này đã tồn tại. Vui lòng chọn slug khác");
        }

        CategoryEntity newCategoryEntity = categoryMapper.toNewEntity(adminCategoryRequestDTO);

        if(adminCategoryRequestDTO.parentId() != null) {
            CategoryEntity existingParentCategoryEntity = categoryRepository.findById(adminCategoryRequestDTO.parentId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tồn tại danh mục cha với id: " + adminCategoryRequestDTO.parentId()
                    ));

            existingParentCategoryEntity.addSubCategory(newCategoryEntity);
        }

        newCategoryEntity = categoryRepository.save(newCategoryEntity);

        return categoryMapper.toAdminResponseDTO(newCategoryEntity);
    }

    @Transactional
    @Override
    public AdminCategoryResponseDTO updateCategory(Integer categoryId, AdminCategoryRequestDTO adminCategoryRequestDTO) {
        if(categoryRepository.existsBySlugAndIdNot(adminCategoryRequestDTO.slug(), categoryId)) {
            throw new IllegalArgumentException("Slug này đã bị danh mục khác sử dụng. Vui lòng chọn slug khác");
        }

        if(adminCategoryRequestDTO.parentId() != null) {
            if(adminCategoryRequestDTO.parentId().equals(categoryId)) {
                throw new IllegalArgumentException("Không thể chọn chính danh mục này làm danh mục cha");
            }
        }

        CategoryEntity existingCategoryEntity = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy danh mục với id: " + categoryId
                ));

        categoryMapper.updateEntityFromRequest(adminCategoryRequestDTO, existingCategoryEntity);

        Integer newParentId = adminCategoryRequestDTO.parentId();
        CategoryEntity oldParentEntity = existingCategoryEntity.getParent();
        Integer oldParentId = (oldParentEntity != null) ? oldParentEntity.getId() : null;

        boolean isParentChanged = !Objects.equals(oldParentId, newParentId);

        if (isParentChanged) {
            if (oldParentEntity != null) {
                oldParentEntity.removeSubCategory(existingCategoryEntity);
            }

            if (newParentId != null) {
                CategoryEntity newParentCategoryEntity = categoryRepository.findById(newParentId)
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Không tìm thấy danh mục cha mới với id: " + newParentId
                        ));
                newParentCategoryEntity.addSubCategory(existingCategoryEntity);
            }
        }

        return categoryMapper.toAdminResponseDTO(existingCategoryEntity);
    }

    @Transactional
    @Override
    public AdminCategoryResponseDTO updateStatusCategory(Integer categoryId, AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO) {
        CategoryEntity categoryEntity = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy danh mục với id: " + categoryId
                ));

        categoryEntity.setStatus(adminUpdateProductStatusRequestDTO.status());

        return categoryMapper.toAdminResponseDTO(categoryEntity);
    }

    @Transactional
    @Override
    public void deleteCategory(Integer categoryId) {
        CategoryEntity existingCategoryEntity = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy danh mục với id: " + categoryId
                ));

        if(categoryRepository.existsByParent_Id(existingCategoryEntity.getId())) {
            throw new IllegalStateException("Không thể xóa! Danh mục này đang chứa các danh mục con bên trong. Vui lòng xóa hoặc di chuyển danh mục con trước.");
        }

        if (productRepository.existsByCategoryId(categoryId)) {
             throw new IllegalStateException("Không thể xóa! Đang có sản phẩm thuộc danh mục này.");
        }

        existingCategoryEntity.setStatus(ProductStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminCategoryResponseDTO> getAllParentCategories(String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<CategoryEntity> categoryEntityPage = categoryRepository.findParentCategoriesWithFilter(finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return categoryEntityPage.map(categoryMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminCategoryResponseDTO> getAllSubCategories(Integer parentId, String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        if(!categoryRepository.existsById(parentId)) {
            throw new EntityNotFoundException("Không tìm thấy danh mục cha với ID: " + parentId);
        }

        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<CategoryEntity> categoryEntityPage = categoryRepository.findSubCategoriesWithFilter(parentId, finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return categoryEntityPage.map(categoryMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminDetailCategoryResponseDTO getCategoryById(Integer categoryId) {
        CategoryEntity existingCategoryEntity = categoryRepository.findCategoryWithDetailsById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy danh mục với id: " + categoryId
                ));

        return categoryMapper.toAdminDetailResponseDTO(existingCategoryEntity);
    }
}
