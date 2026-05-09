package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.AdminBrandRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminBrandResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminBrandService {

    AdminBrandResponseDTO createBrand(AdminBrandRequestDTO adminBrandRequestDTO);
    AdminBrandResponseDTO updateBrand(Integer brandId, AdminBrandRequestDTO adminBrandRequestDTO);
    AdminBrandResponseDTO updateStatusBrand(Integer brandId, AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO);
    void deleteBrand(Integer brandId);
    Page<AdminBrandResponseDTO> getAllBrands(String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminBrandResponseDTO getBrandById(Integer brandId);
}
