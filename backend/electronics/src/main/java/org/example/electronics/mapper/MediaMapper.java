package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.media.AdminAddMediaRequestDTO;
import org.example.electronics.dto.request.admin.media.AdminNestedMediaRequestDTO;
import org.example.electronics.dto.response.admin.AdminMediaResponseDTO;
import org.example.electronics.entity.MediaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface MediaMapper {

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "variant", ignore = true)
    MediaEntity toNewEntity(AdminAddMediaRequestDTO adminAddMediaRequestDTO);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "variant", ignore = true)
    MediaEntity nestedDTO_toNewEntity(AdminNestedMediaRequestDTO adminNestedMediaRequestDTO);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "variant.id", target = "variantId")
    AdminMediaResponseDTO toAdminResponseDTO(MediaEntity mediaEntity);
}
