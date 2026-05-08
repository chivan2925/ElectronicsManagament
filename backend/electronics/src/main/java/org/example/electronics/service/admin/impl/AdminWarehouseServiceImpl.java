package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.warehouse.AdminUpdateWarehouseStatusRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.AdminWarehouseDetailRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.AdminWarehouseRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.AdminWarehouseResponseDTO;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.enums.*;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.example.electronics.mapper.WarehouseMapper;
import org.example.electronics.repository.VariantRepository;
import org.example.electronics.repository.WarehouseRepository;
import org.example.electronics.service.admin.AdminWarehouseService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminWarehouseServiceImpl implements AdminWarehouseService {

    private final WarehouseMapper warehouseMapper;

    private final WarehouseRepository warehouseRepository;
    private final VariantRepository variantRepository;

    @Transactional
    @Override
    public AdminWarehouseResponseDTO createWarehouse(AdminWarehouseRequestDTO adminWarehouseRequestDTO) {
        if (warehouseRepository.existsByName(adminWarehouseRequestDTO.name())) {
            throw new IllegalArgumentException("Tạo kho hàng thất bại: Tên nhà kho này đã tồn tại");
        }

        int totalQuantity = 0;
        WarehouseEntity newWarehouseEntity = warehouseMapper.toNewEntity(adminWarehouseRequestDTO);

        if (adminWarehouseRequestDTO.warehouseDetails() != null) {
            for (AdminWarehouseDetailRequestDTO adminWarehouseDetailRequestDTO : adminWarehouseRequestDTO.warehouseDetails()) {
                VariantEntity variantEntityProxy = variantRepository.getReferenceById(adminWarehouseDetailRequestDTO.variantId());

                WarehouseDetailEntity warehouseDetailEntity = WarehouseDetailEntity.builder()
                        .variant(variantEntityProxy)
                        .quantity(adminWarehouseDetailRequestDTO.quantity())
                        .build();

                newWarehouseEntity.addWarehouseDetail(warehouseDetailEntity);

                totalQuantity += adminWarehouseDetailRequestDTO.quantity();
            }
        }

        if (totalQuantity > newWarehouseEntity.getCapacity()) {
            throw new IllegalArgumentException("Tạo kho hàng thất bại: Tổng số lượng hàng hóa (" + totalQuantity + ") vượt quá sức chứa của kho (" + newWarehouseEntity.getCapacity() + ")");
        }
        newWarehouseEntity.setCurrentStock(totalQuantity);

        newWarehouseEntity = warehouseRepository.save(newWarehouseEntity);

        return warehouseMapper.toAdminResponseDTO(newWarehouseEntity);
    }

    @Transactional
    @Override
    public AdminWarehouseResponseDTO updateWarehouse(Integer warehouseId, AdminWarehouseRequestDTO adminWarehouseRequestDTO) {
        if (warehouseRepository.existsByNameAndIdNot(adminWarehouseRequestDTO.name(), warehouseId)) {
            throw new IllegalArgumentException("Cập nhật kho hàng thất bại: Tên nhà kho này đã bị trùng với một nhà kho khác");
        }

        WarehouseEntity existingWarehouseEntity = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cập nhật kho hàng thất bại: Không tìm thấy nhà kho với id: " + warehouseId
                ));

        warehouseMapper.updateEntityFromRequest(adminWarehouseRequestDTO, existingWarehouseEntity);

        if (adminWarehouseRequestDTO.warehouseDetails() != null) {
            Map<Integer, Integer> incomingWarehouseDetailsMap = adminWarehouseRequestDTO.warehouseDetails().stream()
                    .collect(Collectors.toMap(
                            AdminWarehouseDetailRequestDTO::variantId,
                            AdminWarehouseDetailRequestDTO::quantity,
                            (oldValue, newValue) -> {
                                throw new IllegalArgumentException(
                                        "Cập nhật kho hàng thất bại: Có nhiều biến thể trùng, " +
                                        "Hệ thống không biết nên lấy số lượng cũ là " + oldValue + " hay số lượng mới là " + newValue
                                );
                            }
                    ));

            List<WarehouseDetailEntity> warehouseDetailsToRemove = new ArrayList<>();

            for(WarehouseDetailEntity existingWarehouseDetail : existingWarehouseEntity.getWarehouseDetails()) {
                Integer variantId = existingWarehouseDetail.getVariant().getId();

                if(incomingWarehouseDetailsMap.containsKey(variantId)) {
                    existingWarehouseDetail.setQuantity(incomingWarehouseDetailsMap.get(variantId));

                    incomingWarehouseDetailsMap.remove(variantId);
                }
                else {
                    warehouseDetailsToRemove.add(existingWarehouseDetail);
                }
            }

            for (WarehouseDetailEntity warehouseDetailToRemove : warehouseDetailsToRemove) {
                existingWarehouseEntity.removeWarehouseDetail(warehouseDetailToRemove);
            }

            for (Map.Entry<Integer, Integer> entry : incomingWarehouseDetailsMap.entrySet()) {
                VariantEntity variantEntityProxy = variantRepository.getReferenceById(entry.getKey());

                WarehouseDetailEntity newWarehouseDetailEntity = WarehouseDetailEntity.builder()
                        .variant(variantEntityProxy)
                        .quantity(entry.getValue())
                        .build();

                existingWarehouseEntity.addWarehouseDetail(newWarehouseDetailEntity);
            }
        }
        else {
            List<WarehouseDetailEntity> allWarehouseDetailsEntity = new ArrayList<>(existingWarehouseEntity.getWarehouseDetails());
            for (WarehouseDetailEntity warehouseDetailEntity : allWarehouseDetailsEntity) {
                existingWarehouseEntity.removeWarehouseDetail(warehouseDetailEntity);
            }
        }

        int totalQuantity = existingWarehouseEntity.getWarehouseDetails().stream()
                .mapToInt(WarehouseDetailEntity::getQuantity)
                .sum();

        if (totalQuantity > existingWarehouseEntity.getCapacity()) {
            throw new IllegalArgumentException("Cập nhật kho hàng thất bại: Tổng số lượng hàng hóa (" + totalQuantity + ") sẽ vượt quá sức chứa của kho (" + existingWarehouseEntity.getCapacity() + ")");
        }
        existingWarehouseEntity.setCurrentStock(totalQuantity);


        return warehouseMapper.toAdminResponseDTO(existingWarehouseEntity);
    }

    @Transactional
    @Override
    public AdminWarehouseResponseDTO updateStatusWarehouse(Integer warehouseId, AdminUpdateWarehouseStatusRequestDTO adminUpdateWarehouseStatusRequestDTO) {
        WarehouseEntity existingWarehouseEntity = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cập nhật trạng thái kho hàng thất bại: Không tìm thấy nhà kho với id: " + warehouseId
                ));

        existingWarehouseEntity.setStatus(adminUpdateWarehouseStatusRequestDTO.status());

        return warehouseMapper.toAdminResponseDTO(existingWarehouseEntity);
    }

    @Transactional
    @Override
    public void deleteWarehouse(Integer warehouseId) {
        WarehouseEntity existingWarehouseEntity = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Xoá kho hàng thất bại: Không tìm thấy nhà kho với id: " + warehouseId
                ));

        existingWarehouseEntity.setStatus(WarehouseStatus.DELETED);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminWarehouseResponseDTO> getAllWarehouses(String keyword, WarehouseStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<WarehouseEntity> warehouseEntityPagePage = warehouseRepository.findWarehousesWithFilter(finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return warehouseEntityPagePage.map(warehouseMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminWarehouseResponseDTO getWarehouseById(Integer warehouseId) {
        WarehouseEntity existingWarehouseEntity = warehouseRepository.findWarehouseWithDetailsById(warehouseId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Xem chi tiết kho hàng thất bại: Không tìm thấy nhà kho với id: " + warehouseId
                ));

        return warehouseMapper.toAdminResponseDTO(existingWarehouseEntity);
    }
}
