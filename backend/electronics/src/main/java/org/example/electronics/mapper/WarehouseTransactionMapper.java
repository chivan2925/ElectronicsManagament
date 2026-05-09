package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.warehouse.transaction.AdminWarehouseTransactionRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.transaction.AdminWarehouseTransactionDetailResponseDTO;
import org.example.electronics.dto.response.admin.warehouse.transaction.AdminWarehouseTransactionResponseDTO;
import org.example.electronics.entity.warehouse.transaction.WarehouseTransactionDetailEntity;
import org.example.electronics.entity.warehouse.transaction.WarehouseTransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WarehouseTransactionMapper {

    @Mapping(target = "warehouseTransactionDetails", ignore = true)
    WarehouseTransactionEntity toNewEntity(AdminWarehouseTransactionRequestDTO adminWarehouseTransactionRequestDTO);

    @Mapping(source = "warehouse.id", target = "warehouseId")
    @Mapping(source = "warehouse.name", target = "warehouseName")
    @Mapping(source = "staff.id", target = "staffId")
    @Mapping(source = "staff.fullName", target = "staffFullName")
    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "returnRequest.id", target = "returnRequestId")
    AdminWarehouseTransactionResponseDTO toAdminResponseDTO(WarehouseTransactionEntity warehouseTransactionEntity);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "variant.name", target = "variantName")
    AdminWarehouseTransactionDetailResponseDTO toDetailResponseDTO(WarehouseTransactionDetailEntity warehouseTransactionDetailEntity);

    @Mapping(target = "warehouseTransactionDetails", ignore = true)
    void updateEntityFromDTO(AdminWarehouseTransactionRequestDTO adminWarehouseTransactionRequestDTO,
                             @MappingTarget WarehouseTransactionEntity warehouseTransactionEntity);
}
