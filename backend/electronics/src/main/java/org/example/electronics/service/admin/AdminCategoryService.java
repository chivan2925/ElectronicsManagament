package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.request.admin.AdminCategoryRequestDTO;
import org.example.electronics.dto.response.admin.category.AdminCategoryResponseDTO;

import org.example.electronics.dto.response.admin.category.AdminDetailCategoryResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminCategoryService {

    AdminCategoryResponseDTO createCategory(AdminCategoryRequestDTO adminCategoryRequestDTO);
    AdminCategoryResponseDTO updateCategory(Integer categoryId, AdminCategoryRequestDTO adminCategoryRequestDTO);
    AdminCategoryResponseDTO updateStatusCategory(Integer categoryId, AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO);
    void deleteCategory(Integer categoryId);
    Page<AdminCategoryResponseDTO> getAllParentCategories(String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    Page<AdminCategoryResponseDTO> getAllSubCategories(Integer parentId, String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminDetailCategoryResponseDTO getCategoryById(Integer categoryId);
}
