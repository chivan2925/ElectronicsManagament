package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.warehouse.AdminWarehouseRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.AdminWarehouseDetailResponseDTO;
import org.example.electronics.dto.response.admin.warehouse.AdminWarehouseResponseDTO;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.example.electronics.entity.warehouse.WarehouseEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WarehouseMapper {

    @Mapping(target = "warehouseDetails", ignore = true)
    WarehouseEntity toNewEntity(AdminWarehouseRequestDTO adminWarehouseRequestDTO);

    AdminWarehouseResponseDTO toAdminResponseDTO(WarehouseEntity warehouseEntity);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "variant.name", target = "variantName")
    AdminWarehouseDetailResponseDTO toDetailResponseDTO(WarehouseDetailEntity warehouseDetailEntity);

    @Mapping(target = "warehouseDetails", ignore = true)
    void updateEntityFromRequest(AdminWarehouseRequestDTO adminWarehouseRequestDTO,
                                 @MappingTarget WarehouseEntity warehouseEntity);
}
