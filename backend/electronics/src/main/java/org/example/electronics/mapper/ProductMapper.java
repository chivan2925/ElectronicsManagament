package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.AdminProductRequestDTO;
import org.example.electronics.dto.response.admin.product.AdminDetailProductResponseDTO;
import org.example.electronics.dto.response.admin.product.AdminProductResponseDTO;
import org.example.electronics.entity.MediaEntity;
import org.example.electronics.entity.ProductEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.enums.ProductStatus;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {VariantMapper.class, CategoryMapper.class, BrandMapper.class, MediaMapper.class}
)
public interface ProductMapper {

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "media", ignore = true)
    ProductEntity toNewEntity(AdminProductRequestDTO adminProductRequestDTO);

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "brand.name", target = "brandName")
    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "media", target = "primaryImageUrl", qualifiedByName = "getPrimaryImageFromProduct")
    @Mapping(source = "variants", target = "price", qualifiedByName = "getMinVariantPrice")
    @Mapping(source = "variants", target = "stock", qualifiedByName = "getTotalVariantStock")
    AdminProductResponseDTO toAdminResponseDTO(ProductEntity productEntity);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    @Mapping(source = "media", target = "primaryImageUrl", qualifiedByName = "getPrimaryImageFromProduct")
    @Mapping(source = "variants", target = "price", qualifiedByName = "getMinVariantPrice")
    @Mapping(source = "variants", target = "stock", qualifiedByName = "getTotalVariantStock")
    AdminDetailProductResponseDTO toAdminDetailResponseDTO(ProductEntity productEntity);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "media", ignore = true)
    void updateEntityFromRequest(AdminProductRequestDTO adminProductRequestDTO,
                                 @MappingTarget ProductEntity productEntity);

    @SuppressWarnings("unused")
    @Named("getPrimaryImageFromProduct")
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

    @SuppressWarnings("unused")
    @Named("getMinVariantPrice")
    default BigDecimal getMinVariantPrice(Set<VariantEntity> variantEntitySet) {
        if (variantEntitySet == null || variantEntitySet.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return variantEntitySet.stream()
                .filter(variant -> variant.getPrice() != null)
                .filter(variant -> variant.getStatus() != ProductStatus.DELETED)
                .map(VariantEntity::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    @SuppressWarnings("unused")
    @Named("getTotalVariantStock")
    default Integer getTotalVariantStock(Set<VariantEntity> variantEntitySet) {
        if (variantEntitySet == null || variantEntitySet.isEmpty()) {
            return 0;
        }

        return variantEntitySet.stream()
                .filter(variant -> variant.getStatus() != ProductStatus.DELETED)
                .map(VariantEntity::getTotalStock)
                .filter(stock -> stock != null)
                .reduce(0, Integer::sum);
    }
}
