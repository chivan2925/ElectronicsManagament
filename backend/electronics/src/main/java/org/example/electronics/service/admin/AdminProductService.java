package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.AdminProductRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateProductStatusRequestDTO;
import org.example.electronics.dto.response.admin.product.AdminDetailProductResponseDTO;
import org.example.electronics.dto.response.admin.product.AdminProductResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminProductService {

    AdminProductResponseDTO createProduct(AdminProductRequestDTO adminProductRequestDTO);
    AdminProductResponseDTO updateProduct(Integer productId, AdminProductRequestDTO adminProductRequestDTO);
    AdminProductResponseDTO updateStatusProduct(Integer productId, AdminUpdateProductStatusRequestDTO adminUpdateProductStatusRequestDTO);
    void deleteProduct(Integer productId);
    Page<AdminProductResponseDTO> getAllProducts(String keyword, ProductStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminDetailProductResponseDTO getProductById(Integer productId);
}
