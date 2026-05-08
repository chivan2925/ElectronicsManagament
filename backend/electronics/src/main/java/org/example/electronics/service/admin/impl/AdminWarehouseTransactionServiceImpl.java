package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.dto.request.admin.status.AdminUpdateWarehouseTransactionTypeStatusRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.transaction.AdminWarehouseTransactionDetailRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.transaction.AdminWarehouseTransactionRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.transaction.AdminWarehouseTransactionResponseDTO;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;
import org.example.electronics.entity.order.OrderDetailEntity;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.example.electronics.entity.warehouse.transaction.WarehouseTransactionDetailEntity;
import org.example.electronics.entity.warehouse.transaction.WarehouseTransactionEntity;
import org.example.electronics.mapper.WarehouseTransactionMapper;
import org.example.electronics.repository.*;
import org.example.electronics.service.admin.AdminWarehouseTransactionService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminWarehouseTransactionServiceImpl implements AdminWarehouseTransactionService {

    private final WarehouseTransactionMapper warehouseTransactionMapper;
    private final WarehouseTransactionRepository warehouseTransactionRepository;

    private final StaffRepository staffRepository;
    private final WarehouseRepository warehouseRepository;
    private final VariantRepository variantRepository;
    private final OrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;

    private static final Map<WarehouseTransactionStatus, Set<WarehouseTransactionStatus>> ALLOWED_WAREHOUSE_TRANSITIONS = Map.of(
            WarehouseTransactionStatus.PENDING, Set.of(
                    WarehouseTransactionStatus.COMPLETED,
                    WarehouseTransactionStatus.FAILED,
                    WarehouseTransactionStatus.CANCELLED,
                    WarehouseTransactionStatus.DELETED
            ),

            WarehouseTransactionStatus.COMPLETED, Set.of(),
            WarehouseTransactionStatus.FAILED, Set.of(),
            WarehouseTransactionStatus.CANCELLED, Set.of(),
            WarehouseTransactionStatus.DELETED, Set.of()
    );

    @Transactional
    @Override
    public AdminWarehouseTransactionResponseDTO createWarehouseTransaction(AdminWarehouseTransactionRequestDTO adminWarehouseTransactionRequestDTO, Integer staffId) {
        if (warehouseTransactionRepository.existsByCode(adminWarehouseTransactionRequestDTO.code())) {
            throw new IllegalArgumentException("Code giao dịch kho này đã tồn tại");
        }

        WarehouseTransactionEntity newWarehouseTransactionEntity = warehouseTransactionMapper.toNewEntity(adminWarehouseTransactionRequestDTO);

        setWarehouseTransactionRelationships(newWarehouseTransactionEntity, adminWarehouseTransactionRequestDTO, staffId);

        for (AdminWarehouseTransactionDetailRequestDTO adminWarehouseTransactionDetailRequestDTO : adminWarehouseTransactionRequestDTO.warehouseTransactionDetails()) {
            VariantEntity variantEntityProxy = variantRepository.getReferenceById(adminWarehouseTransactionDetailRequestDTO.variantId());

            WarehouseTransactionDetailEntity warehouseTransactionDetailEntity = WarehouseTransactionDetailEntity.builder()
                    .variant(variantEntityProxy)
                    .quantity(adminWarehouseTransactionDetailRequestDTO.quantity())
                    .build();

            newWarehouseTransactionEntity.addWarehouseTransactionDetail(warehouseTransactionDetailEntity);
        }

        newWarehouseTransactionEntity = warehouseTransactionRepository.save(newWarehouseTransactionEntity);

        return warehouseTransactionMapper.toAdminResponseDTO(newWarehouseTransactionEntity);
    }

    @Transactional
    @Override
    public AdminWarehouseTransactionResponseDTO updateWarehouseTransaction(Integer warehouseTransactionId, AdminWarehouseTransactionRequestDTO adminWarehouseTransactionRequestDTO, Integer staffId) {
        if (warehouseTransactionRepository.existsByCodeAndIdNot(adminWarehouseTransactionRequestDTO.code(), warehouseTransactionId)) {
            throw new IllegalArgumentException("Code của giao dịch kho này đã bị trùng với một giao dịch kho khác");
        }

        WarehouseTransactionEntity existingWarehouseTransactionEntity = warehouseTransactionRepository.findWarehouseTransactionWithDetailsById(warehouseTransactionId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy giao dịch kho với id: " + warehouseTransactionId
                ));

        checkWarehouseTransactionEditableOrDeletable(existingWarehouseTransactionEntity);

        if (existingWarehouseTransactionEntity.getStatus() != WarehouseTransactionStatus.PENDING) {
            throw new IllegalArgumentException("Chỉ được sửa đổi thông tin và chi tiết phiếu giao dịch kho khi đang ở trạng thái PENDING");
        }

        warehouseTransactionMapper.updateEntityFromDTO(adminWarehouseTransactionRequestDTO, existingWarehouseTransactionEntity);

        setWarehouseTransactionRelationships(existingWarehouseTransactionEntity, adminWarehouseTransactionRequestDTO, staffId);

        Map<Integer, Integer> incomingDetailsMap = adminWarehouseTransactionRequestDTO.warehouseTransactionDetails().stream()
                .collect(Collectors.toMap(
                        AdminWarehouseTransactionDetailRequestDTO::variantId,
                        AdminWarehouseTransactionDetailRequestDTO::quantity,
                        (oldValue, newValue) -> {
                            throw new IllegalArgumentException(
                                    "Có biến thể bị trùng lặp trong danh sách chi tiết giao dịch kho. " +
                                    "Giá trị cũ: " + oldValue + ", giá trị mới: " + newValue
                            );
                        }
                ));

        List<WarehouseTransactionDetailEntity> detailsToRemove = new ArrayList<>();

        for (WarehouseTransactionDetailEntity existingWarehouseDetail : existingWarehouseTransactionEntity.getWarehouseTransactionDetails()) {
            Integer variantId = existingWarehouseDetail.getVariant().getId();

            if (incomingDetailsMap.containsKey(variantId)) {
                existingWarehouseDetail.setQuantity(incomingDetailsMap.get(variantId));

                incomingDetailsMap.remove(variantId);
            }
            else {
                detailsToRemove.add(existingWarehouseDetail);
            }
        }

        for (WarehouseTransactionDetailEntity detailToRemove : detailsToRemove) {
            existingWarehouseTransactionEntity.removeWarehouseTransactionDetail(detailToRemove);
        }

        for (Map.Entry<Integer, Integer> entryMap : incomingDetailsMap.entrySet()) {
            VariantEntity variantEntityProxy = variantRepository.getReferenceById(entryMap.getKey());

            WarehouseTransactionDetailEntity newWarehouseTransactionDetailEntity = WarehouseTransactionDetailEntity.builder()
                    .variant(variantEntityProxy)
                    .quantity(entryMap.getValue())
                    .build();

            existingWarehouseTransactionEntity.addWarehouseTransactionDetail(newWarehouseTransactionDetailEntity);
        }

        return warehouseTransactionMapper.toAdminResponseDTO(existingWarehouseTransactionEntity);
    }

    @Transactional
    @Override
    public AdminWarehouseTransactionResponseDTO updateStatusWarehouseTransaction(Integer warehouseTransactionId, AdminUpdateWarehouseTransactionTypeStatusRequestDTO adminUpdateWarehouseTransactionTypeStatusRequestDTO, Integer staffId) {
        WarehouseTransactionEntity existingWarehouseTransactionEntity = warehouseTransactionRepository.findWarehouseTransactionWithDetailsById(warehouseTransactionId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy giao dịch kho với id: " + warehouseTransactionId
                ));

        validateWarehouseTransactionTransition(existingWarehouseTransactionEntity, adminUpdateWarehouseTransactionTypeStatusRequestDTO);

        boolean isCompletingWarehouseTransaction = (existingWarehouseTransactionEntity.getStatus() == WarehouseTransactionStatus.PENDING) &&
                                                (adminUpdateWarehouseTransactionTypeStatusRequestDTO.status() == WarehouseTransactionStatus.COMPLETED);

        if(isCompletingWarehouseTransaction) {
            processWarehouseUpdate(existingWarehouseTransactionEntity, false);
        }

        existingWarehouseTransactionEntity.setStaff(staffRepository.getReferenceById(staffId));

        existingWarehouseTransactionEntity.setStatus(adminUpdateWarehouseTransactionTypeStatusRequestDTO.status());

        return warehouseTransactionMapper.toAdminResponseDTO(existingWarehouseTransactionEntity);
    }

    @Transactional
    @Override
    public void deleteWarehouseTransaction(Integer warehouseTransactionId, Integer staffId) {
        WarehouseTransactionEntity existingWarehouseTransactionEntity = warehouseTransactionRepository.findById(warehouseTransactionId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy giao dịch kho với id: " + warehouseTransactionId
                ));

        checkWarehouseTransactionEditableOrDeletable(existingWarehouseTransactionEntity);

        existingWarehouseTransactionEntity.setStaff(staffRepository.getReferenceById(staffId));

        existingWarehouseTransactionEntity.setStatus(WarehouseTransactionStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminWarehouseTransactionResponseDTO> getAllWarehouseTransactions(String keyword, WarehouseTransactionType type, WarehouseTransactionStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<WarehouseTransactionEntity> warehouseTransactionEntityPage = warehouseTransactionRepository.findWarehouseTransactionsWithFilter(finalKeyword, type, status, typeString, startDateTime, endDateTime, pageable);

        return warehouseTransactionEntityPage.map(warehouseTransactionMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminWarehouseTransactionResponseDTO getWarehouseTransactionById(Integer warehouseTransactionId) {
        WarehouseTransactionEntity existingWarehouseTransactionEntity = warehouseTransactionRepository.findWarehouseTransactionWithDetailsById(warehouseTransactionId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy giao dịch kho với id: " + warehouseTransactionId
                ));

        return warehouseTransactionMapper.toAdminResponseDTO(existingWarehouseTransactionEntity);
    }

    private void validateWarehouseTransactionTransition(WarehouseTransactionEntity currentWarehouseTransaction, AdminUpdateWarehouseTransactionTypeStatusRequestDTO requestDTO) {
        WarehouseTransactionType currentType = currentWarehouseTransaction.getType();
        WarehouseTransactionType newType = requestDTO.type();

        WarehouseTransactionStatus currentStatus = currentWarehouseTransaction.getStatus();
        WarehouseTransactionStatus newStatus = requestDTO.status();

        if (currentType != newType) {
            if (currentStatus != WarehouseTransactionStatus.PENDING) {
                throw new IllegalArgumentException(
                        "Phiếu kho đã chốt (" + currentStatus + "), không thể đổi loại giao dịch từ " + currentType + " sang " + newType
                );
            }
        }

        if (currentStatus == newStatus) {
            return;
        }

        Set<WarehouseTransactionStatus> allowedNextStates = ALLOWED_WAREHOUSE_TRANSITIONS.getOrDefault(currentStatus, Set.of());

        if (!allowedNextStates.contains(newStatus)) {
            throw new IllegalArgumentException(
                    String.format("Chuyển đổi trạng thái phiếu kho không hợp lệ, không thể chuyển từ '%s' sang '%s'", currentStatus, newStatus)
            );
        }
    }

    private void setWarehouseTransactionRelationships(WarehouseTransactionEntity entity, AdminWarehouseTransactionRequestDTO requestDTO, Integer staffId) {
        entity.setStaff(staffRepository.getReferenceById(staffId));
        entity.setWarehouse(warehouseRepository.getReferenceById(requestDTO.warehouseId()));

        if (requestDTO.orderId() != null) {
            entity.setOrder(orderRepository.getReferenceById(requestDTO.orderId()));
        }
        else {
            entity.setOrder(null);
        }

        if (requestDTO.returnRequestId() != null) {
            entity.setReturnRequest(returnRequestRepository.getReferenceById(requestDTO.returnRequestId()));
        }
        else {
            entity.setReturnRequest(null);
        }
    }

    private void processWarehouseUpdate(WarehouseTransactionEntity existingWarehouseTransactionEntity, boolean isInward) {
        WarehouseEntity warehouse = existingWarehouseTransactionEntity.getWarehouse();
        int totalQuantityChange = 0;
        List<WarehouseDetailEntity> emptyDetailsToRemove = new ArrayList<>();

        for (WarehouseTransactionDetailEntity transactionDetail : existingWarehouseTransactionEntity.getWarehouseTransactionDetails()) {
            VariantEntity variant = transactionDetail.getVariant();
            int transactionQuantity = transactionDetail.getQuantity();

            Optional<WarehouseDetailEntity> existingStockOpt = warehouse.getWarehouseDetails().stream()
                    .filter(wd -> wd.getVariant().getId().equals(variant.getId()))
                    .findFirst();

            if (isInward) {
                totalQuantityChange += transactionQuantity;
                variant.setTotalStock(variant.getTotalStock() + transactionQuantity);

                if (existingStockOpt.isPresent()) {
                    WarehouseDetailEntity existingStock = existingStockOpt.get();
                    existingStock.setQuantity(existingStock.getQuantity() + transactionQuantity);
                } else {
                    warehouse.addWarehouseDetail(
                            WarehouseDetailEntity.builder()
                                    .variant(variant)
                                    .quantity(transactionQuantity)
                                    .build()
                    );
                }
            } else {
                totalQuantityChange -= transactionQuantity;

                WarehouseDetailEntity existingStock = existingStockOpt.orElseThrow(
                        () -> new IllegalArgumentException("Lỗi kho: Kho " + warehouse.getName() + " không có mặt hàng " + variant.getName())
                );

                if (existingStock.getQuantity() < transactionQuantity) {
                    throw new IllegalArgumentException("Lỗi kho: Kho " + warehouse.getName() + " không đủ số lượng cho " + variant.getName());
                }

                if (variant.getTotalStock() < transactionQuantity) {
                    throw new IllegalArgumentException("Lỗi dữ liệu: Tổng tồn kho đang nhỏ hơn Tồn kho thực tế ở chi nhánh!");
                }

                variant.setTotalStock(variant.getTotalStock() - transactionQuantity);
                existingStock.setQuantity(existingStock.getQuantity() - transactionQuantity);

                if (existingStock.getQuantity() == 0) {
                    emptyDetailsToRemove.add(existingStock);
                }
            }
        }

        for (WarehouseDetailEntity emptyDetail : emptyDetailsToRemove) {
            warehouse.removeWarehouseDetail(emptyDetail);
        }

        int newWarehouseStock = warehouse.getCurrentStock() + totalQuantityChange;

        if (newWarehouseStock > warehouse.getCapacity()) {
            throw new IllegalArgumentException("Lỗi kho: Vượt quá sức chứa của kho (Sức chứa: " + warehouse.getCapacity() + ", Sau khi nhập: " + newWarehouseStock + ")");
        }

        warehouse.setCurrentStock(newWarehouseStock);
    }

    @Transactional
    @Override
    public void autoCreateReturnWarehouseTransactionForReturnRequest(ReturnRequestEntity returnRequestEntity, Integer staffId) {
        WarehouseEntity originalWarehouse = warehouseTransactionRepository.findSourceWarehouseForOrderItem(
                returnRequestEntity.getOrder().getId(),
                returnRequestEntity.getVariant().getId(),
                WarehouseTransactionType.EXPORT
        ).orElseThrow(() -> new IllegalStateException(
                "Không tìm thấy lịch sử xuất kho gốc của Biến thể ID "
                        + returnRequestEntity.getVariant().getId() + " trong Đơn hàng ID " + returnRequestEntity.getOrder().getId()
        ));

        WarehouseTransactionEntity newWarehouseTransaction = WarehouseTransactionEntity.builder()
                .code("RET-" + returnRequestEntity.getId() + "-" + System.currentTimeMillis())
                .type(WarehouseTransactionType.RETURN)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .warehouse(originalWarehouse)
                .order(returnRequestEntity.getOrder())
                .returnRequest(returnRequestEntity)
                .build();

        WarehouseTransactionDetailEntity txDetail = WarehouseTransactionDetailEntity.builder()
                .variant(returnRequestEntity.getVariant())
                .quantity(returnRequestEntity.getQuantity())
                .build();
        newWarehouseTransaction.addWarehouseTransactionDetail(txDetail);

        processWarehouseUpdate(newWarehouseTransaction, true);

        warehouseTransactionRepository.save(newWarehouseTransaction);

        log.info("Đã tự động tạo phiếu kho RETURN cho đơn hàng ID: {}", returnRequestEntity.getId());
    }

    @Transactional
    @Override
    public void autoCreateReservedWarehouseTransactionForOrder(OrderEntity order, Integer staffId) {
        WarehouseEntity targetWarehouse = warehouseRepository.findAll().stream()
                .max(Comparator.comparingInt(w -> calculateMatchScore(w, order)))
                .orElseThrow(() -> new IllegalStateException("Hệ thống không có kho nào"));

        WarehouseTransactionEntity reservedTx = WarehouseTransactionEntity.builder()
                .code("RES-" + order.getId() + "-" + System.currentTimeMillis())
                .type(WarehouseTransactionType.RESERVED)
                .warehouse(targetWarehouse)
                .order(order)
                .status(WarehouseTransactionStatus.COMPLETED)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .build();

        for (OrderDetailEntity detail : order.getOrderDetails()) {
            int available = targetWarehouse.getWarehouseDetails().stream()
                    .filter(wd -> wd.getVariant().getId().equals(detail.getVariant().getId()))
                    .mapToInt(WarehouseDetailEntity::getQuantity).findFirst().orElse(0);

            if (available < detail.getQuantity()) {
                handleInternalConsolidation(targetWarehouse, detail.getVariant(), detail.getQuantity() - available, order, null);
            }

            reservedTx.addWarehouseTransactionDetail(WarehouseTransactionDetailEntity.builder()
                    .variant(detail.getVariant()).quantity(detail.getQuantity()).build());
        }

        processWarehouseUpdate(reservedTx, false);
        warehouseTransactionRepository.save(reservedTx);
    }

    @Transactional
    @Override
    public void autoCreateUnreservedTransactionForOrder(OrderEntity order, Integer staffId) {
        WarehouseTransactionEntity reservation = warehouseTransactionRepository
                .findByOrderAndType(order, WarehouseTransactionType.RESERVED)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy phiếu giữ chỗ cho đơn " + order.getId()));

        WarehouseEntity sourceWarehouse = reservation.getWarehouse();

        WarehouseTransactionEntity unresTx = WarehouseTransactionEntity.builder()
                .code("UNRES" + order.getId() + "-" + System.currentTimeMillis())
                .type(WarehouseTransactionType.UNRESERVED)
                .staff(null)
                .warehouse(sourceWarehouse)
                .order(order)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .build();

        for (OrderDetailEntity orderDetail : order.getOrderDetails()) {
            WarehouseTransactionDetailEntity txDetail = WarehouseTransactionDetailEntity.builder()
                    .variant(orderDetail.getVariant())
                    .quantity(orderDetail.getQuantity())
                    .build();

            unresTx.addWarehouseTransactionDetail(txDetail);
        }

        processWarehouseUpdate(unresTx, true);

        warehouseTransactionRepository.save(unresTx);

        log.info("Đã tự động tạo phiếu kho UNRESERVED cho đơn hàng ID: {}", order.getId());
    }

    @Override
    public void autoCreateNewExportWarehouseTransactionForOrder(OrderEntity order, Integer staffId) {
        WarehouseEntity targetWarehouse = warehouseRepository.findAll().stream()
                .max(Comparator.comparingInt(w -> calculateMatchScore(w, order)))
                .orElseThrow(() -> new IllegalStateException("Không có kho nào trong hệ thống để xuất hàng"));

        for (OrderDetailEntity orderDetail : order.getOrderDetails()) {
            int requiredQuantity = orderDetail.getQuantity();

            int availableAtTarget = targetWarehouse.getWarehouseDetails().stream()
                    .filter(wd -> wd.getVariant().getId().equals(orderDetail.getVariant().getId()))
                    .mapToInt(WarehouseDetailEntity::getQuantity)
                    .findFirst()
                    .orElse(0);

            if (availableAtTarget < requiredQuantity) {
                int missingQuantity = requiredQuantity - availableAtTarget;

                handleInternalConsolidation(targetWarehouse, orderDetail.getVariant(), missingQuantity, order, staffId);
            }
        }

        WarehouseTransactionEntity newExportTx = WarehouseTransactionEntity.builder()
                .code("EX-" + order.getId() + "-" + System.currentTimeMillis())
                .type(WarehouseTransactionType.EXPORT)
                .warehouse(targetWarehouse)
                .order(order)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .build();

        for (OrderDetailEntity orderDetail: order.getOrderDetails()) {
            WarehouseTransactionDetailEntity txDetail = WarehouseTransactionDetailEntity.builder()
                    .variant(orderDetail.getVariant())
                    .quantity(orderDetail.getQuantity())
                    .build();

            newExportTx.addWarehouseTransactionDetail(txDetail);
        }

        processWarehouseUpdate(newExportTx, false);

        warehouseTransactionRepository.save(newExportTx);

        log.info("Đã tự động tạo phiếu xuất kho EXPORT cho đơn hàng ID: {}", order.getId());
    }

    @Transactional
    @Override
    public void autoCreateReturnWarehouseTransactionForOrder(OrderEntity order, Integer staffId) {
        WarehouseTransactionEntity originExportTx = warehouseTransactionRepository
                .findByOrderAndType(order, WarehouseTransactionType.EXPORT)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy phiếu xuất kho gốc của đơn hàng " + order.getCode()
                ));

        WarehouseEntity originWarehouse = originExportTx.getWarehouse();

        WarehouseTransactionEntity returnTx = WarehouseTransactionEntity.builder()
                .code("RET-" + order.getId() + "-" + System.currentTimeMillis())
                .type(WarehouseTransactionType.RETURN)
                .warehouse(originWarehouse)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .order(order)
                .status(WarehouseTransactionStatus.COMPLETED)
                .note("Hoàn trả từ đơn hàng bị huỷ/trả: " + order.getCode())
                .build();

        for (WarehouseTransactionDetailEntity exportDetail : originExportTx.getWarehouseTransactionDetails()) {
            returnTx.addWarehouseTransactionDetail(WarehouseTransactionDetailEntity.builder()
                    .variant(exportDetail.getVariant())
                    .quantity(exportDetail.getQuantity())
                    .build());
        }

        processWarehouseUpdate(returnTx, true);

        warehouseTransactionRepository.save(returnTx);
        log.info("Đã tự động tạo phiếu RETURN hoàn trả hàng cho đơn ID: {}", order.getId());
    }

    private void handleInternalConsolidation(WarehouseEntity targetWarehouse, VariantEntity variant, int missingQuantity, OrderEntity order, Integer staffId) {
        List<WarehouseEntity> otherWarehouses = warehouseRepository.findAll().stream()
                .filter(w -> !w.getId().equals(targetWarehouse.getId()))
                .toList();

        int collected = 0;
        for (WarehouseEntity sourceWarehouse : otherWarehouses) {
            if (collected > missingQuantity) {
                break;
            }

            int stockInSource = sourceWarehouse.getWarehouseDetails().stream()
                    .filter(wd -> wd.getVariant().getId().equals(variant.getId()))
                    .mapToInt(WarehouseDetailEntity::getQuantity)
                    .findFirst()
                    .orElse(0);

            if (stockInSource > 0) {
                int take = Math.min(stockInSource, missingQuantity - collected);

                createInternalTransferPair(sourceWarehouse, targetWarehouse, variant, take, order, staffId);

                collected += take;
            }
        }

        if (collected < missingQuantity) {
            throw new IllegalArgumentException("Tổng kho hệ thống không đủ hàng cho biến thể: " + variant.getName());
        }
    }

    private void createInternalTransferPair(WarehouseEntity source, WarehouseEntity target, VariantEntity variant, int quantity, OrderEntity order, Integer staffId) {
        long timestamp = System.currentTimeMillis();
        String transferCode = "I_TRF-" + order.getId() + "-" + variant.getId();

        WarehouseTransactionEntity outTx = WarehouseTransactionEntity.builder()
                .code(transferCode + "-OUT-" + timestamp)
                .type(WarehouseTransactionType.INTERNAL_TRANSFER)
                .warehouse(source)
                .order(order)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .build();

        outTx.addWarehouseTransactionDetail(
                WarehouseTransactionDetailEntity.builder()
                        .variant(variant)
                        .quantity(quantity)
                        .build()
        );

        processWarehouseUpdate(outTx, false);

        warehouseTransactionRepository.save(outTx);

        WarehouseTransactionEntity inTx = WarehouseTransactionEntity.builder()
                .code(transferCode + "-IN-" + timestamp)
                .type(WarehouseTransactionType.INTERNAL_TRANSFER)
                .warehouse(target)
                .order(order)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .build();

        inTx.addWarehouseTransactionDetail(
                WarehouseTransactionDetailEntity.builder()
                        .variant(variant)
                        .quantity(quantity)
                        .build()
        );

        processWarehouseUpdate(inTx, true);

        warehouseTransactionRepository.save(inTx);
    }

    private int calculateMatchScore(WarehouseEntity warehouse, OrderEntity order) {
        return (int) order.getOrderDetails().stream()
                .filter(orderDetail -> warehouse.getWarehouseDetails().stream()
                        .anyMatch(wd -> wd.getVariant().getId().equals(orderDetail.getVariant().getId()) && wd.getQuantity() > 0))
                .count();
    }

    @Transactional
    @Override
    public void convertToExportFromReserved(OrderEntity order, Integer staffId) {
        WarehouseTransactionEntity reservedTx = warehouseTransactionRepository
                .findByOrderAndType(order, WarehouseTransactionType.RESERVED)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy phiếu giữ chỗ (RESERVED) cho đơn hàng: " + order.getCode()));

        WarehouseTransactionEntity exportTx = WarehouseTransactionEntity.builder()
                .code("EXPORT-" + order.getId() + "-" + System.currentTimeMillis())
                .type(WarehouseTransactionType.EXPORT)
                .warehouse(reservedTx.getWarehouse())
                .order(order)
                .staff(staffId != null ? staffRepository.getReferenceById(staffId) : null)
                .status(WarehouseTransactionStatus.COMPLETED)
                .note("Chuyển đổi từ phiếu giữ chỗ " + reservedTx.getCode() + " sau khi khách thanh toán thành công.")
                .build();

        for (WarehouseTransactionDetailEntity reservedDetail : reservedTx.getWarehouseTransactionDetails()) {
            exportTx.addWarehouseTransactionDetail(WarehouseTransactionDetailEntity.builder()
                    .variant(reservedDetail.getVariant())
                    .quantity(reservedDetail.getQuantity())
                    .build());
        }

        warehouseTransactionRepository.save(exportTx);

        log.info("Đã chuyển đổi thành công phiếu RESERVED sang EXPORT cho đơn hàng: {}", order.getCode());
    }

    private void checkWarehouseTransactionEditableOrDeletable(WarehouseTransactionEntity warehouseTransaction) {
        if (warehouseTransaction.getStatus() != WarehouseTransactionStatus.PENDING) {
            throw new IllegalStateException(
                    "Không thể chỉnh sửa hay xoá! Phiếu giao dịch kho đã chốt ở trạng thái " + warehouseTransaction.getStatus() + ". Chỉ được phép sửa hoặc xoá khi đang PENDING."
            );
        }
    }
}
