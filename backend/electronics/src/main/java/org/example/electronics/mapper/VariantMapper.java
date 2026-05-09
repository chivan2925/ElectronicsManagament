package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.AdminVariantRequestDTO;
import org.example.electronics.dto.response.admin.variant.AdminDetailVariantResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantResponseDTO;
import org.example.electronics.dto.response.admin.variant.AdminVariantWarehouseStockResponseDTO;
import org.example.electronics.entity.MediaEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.warehouse.WarehouseDetailEntity;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {MediaMapper.class}
)
public interface VariantMapper {

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "media", ignore = true)
    VariantEntity toNewEntity(AdminVariantRequestDTO adminVariantRequestDTO);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "media", target = "primaryImageUrl", qualifiedByName = "getPrimaryImage")
    AdminVariantResponseDTO toAdminResponseDTO(VariantEntity variantEntity);

        @Mapping(source = "variantEntity.product.id", target = "productId")
        @Mapping(source = "variantEntity.product.name", target = "productName")
        @Mapping(source = "variantEntity.media", target = "primaryImageUrl", qualifiedByName = "getPrimaryImage")
    @Mapping(source = "totalStock", target = "totalStock")
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
    void updateEntityFromRequest(AdminVariantRequestDTO adminVariantRequestDTO,
                                 @MappingTarget VariantEntity VariantEntity);

        @Named("getPrimaryImage")
        default String getPrimaryImage(Set<MediaEntity> mediaEntitySet) {
                if (mediaEntitySet == null || mediaEntitySet.isEmpty()) {
                        return null;
                }

                return mediaEntitySet.stream()
                                .filter(media -> Boolean.TRUE.equals(media.getIsPrimary()))
                                .map(MediaEntity::getImageUrl)
                                .findFirst()
                                .orElseGet(() -> mediaEntitySet.stream()
                                                .findFirst()
                                                .map(MediaEntity::getImageUrl)
                                                .orElse(null));
        }

}
