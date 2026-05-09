package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.warehouse.AdminWarehouseRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.AdminUpdateWarehouseStatusRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.AdminWarehouseResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.WarehouseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminWarehouseService {

    AdminWarehouseResponseDTO createWarehouse(AdminWarehouseRequestDTO adminWarehouseRequestDTO);
    AdminWarehouseResponseDTO updateWarehouse(Integer warehouseId, AdminWarehouseRequestDTO adminWarehouseRequestDTO);
    AdminWarehouseResponseDTO updateStatusWarehouse(Integer warehouseId, AdminUpdateWarehouseStatusRequestDTO adminUpdateWarehouseStatusRequestDTO);
    void deleteWarehouse(Integer warehouseId);
    Page<AdminWarehouseResponseDTO> getAllWarehouses(String keyword, WarehouseStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminWarehouseResponseDTO getWarehouseById(Integer warehouseId);
}
