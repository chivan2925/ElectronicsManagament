package org.example.electronics.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.example.electronics.dto.request.admin.AdminVariantRequestDTO;
import org.example.electronics.dto.response.admin.variant.AdminDetailVariantResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantWarehouseStockResponseDTO;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.example.electronics.util.MediaUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {MediaMapper.class, MediaUtils.class}
)
public interface VariantMapper {

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(target = "totalStock", ignore = true)
    VariantEntity toNewEntity(AdminVariantRequestDTO adminVariantRequestDTO);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "media", target = "primaryImageUrl", qualifiedByName = "getPrimaryImage")
    AdminVariantResponseDTO toAdminResponseDTO(VariantEntity variantEntity);

    @Mapping(source = "variantEntity.product.id", target = "productId")
    @Mapping(source = "variantEntity.product.name", target = "productName")
    @Mapping(source = "variantEntity.media", target = "primaryImageUrl", qualifiedByName = "getPrimaryImage")
    AdminDetailVariantResponseDTO toAdminDetailResponseDTO(
            VariantEntity variantEntity,
            List<AdminVariantWarehouseStockResponseDTO> warehouseStocks,
            Integer totalStock,
            BigDecimal totalWarehouseValue
    );

    @Mapping(source = "warehouse.id", target = "warehouseId")
    @Mapping(source = "warehouse.name", target = "warehouseName")
    @Mapping(source = "quantity", target = "quantity")
    AdminVariantWarehouseStockResponseDTO toWarehouseStockDTO(WarehouseDetailEntity detail);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(target = "totalStock", ignore = true)
    void updateEntityFromRequest(AdminVariantRequestDTO adminVariantRequestDTO,
                                 @MappingTarget VariantEntity VariantEntity);

}
