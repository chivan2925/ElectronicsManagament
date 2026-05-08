package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.AdminVariantRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.variant.AdminDetailVariantResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminVariantService {
    
    AdminVariantResponseDTO createVariant(AdminVariantRequestDTO adminVariantRequestDTO);
    AdminVariantResponseDTO updateVariant(Integer variantId, AdminVariantRequestDTO adminVariantRequestDTO);
    AdminVariantResponseDTO updateStatusVariant(Integer variantId, AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO);
    void deleteVariant(Integer variantId);
    Page<AdminVariantResponseDTO> getAllVariants(String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminDetailVariantResponseDTO getVariantById(Integer variantId);
}
