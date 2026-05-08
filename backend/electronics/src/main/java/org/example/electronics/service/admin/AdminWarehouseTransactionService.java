package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.status.AdminUpdateWarehouseTransactionTypeStatusRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.transaction.AdminWarehouseTransactionRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.transaction.AdminWarehouseTransactionResponseDTO;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;
import org.example.electronics.entity.order.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminWarehouseTransactionService {

    AdminWarehouseTransactionResponseDTO createWarehouseTransaction(AdminWarehouseTransactionRequestDTO adminWarehouseTransactionRequestDTO, Integer staffId);
    AdminWarehouseTransactionResponseDTO updateWarehouseTransaction(Integer warehouseTransactionId, AdminWarehouseTransactionRequestDTO adminWarehouseTransactionRequestDTO, Integer staffId);
    AdminWarehouseTransactionResponseDTO updateStatusWarehouseTransaction(Integer warehouseTransactionId, AdminUpdateWarehouseTransactionTypeStatusRequestDTO adminUpdateWarehouseTransactionTypeStatusRequestDTO, Integer staffId);
    void deleteWarehouseTransaction(Integer warehouseTransactionId, Integer staffId);
    Page<AdminWarehouseTransactionResponseDTO> getAllWarehouseTransactions(String keyword, WarehouseTransactionType type, WarehouseTransactionStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminWarehouseTransactionResponseDTO getWarehouseTransactionById(Integer warehouseTransactionId);

    void autoCreateReturnWarehouseTransactionForReturnRequest(ReturnRequestEntity returnRequestEntity, Integer staffId);
    void autoCreateUnreservedTransactionForOrder(OrderEntity order, Integer staffId);
    void autoCreateNewExportWarehouseTransactionForOrder(OrderEntity order, Integer staffId);
    void autoCreateReturnWarehouseTransactionForOrder(OrderEntity order, Integer staffId);
    void autoCreateReservedWarehouseTransactionForOrder(OrderEntity order, Integer staffId);
    void convertToExportFromReserved(OrderEntity order, Integer staffId);
}
