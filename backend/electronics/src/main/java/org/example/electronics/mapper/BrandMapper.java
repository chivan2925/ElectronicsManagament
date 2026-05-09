package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.AdminBrandRequestDTO;
import org.example.electronics.dto.response.admin.AdminBrandResponseDTO;
import org.example.electronics.entity.BrandEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface BrandMapper {

    BrandEntity toNewEntity(AdminBrandRequestDTO adminBrandRequestDTO);

    AdminBrandResponseDTO toAdminResponseDTO(BrandEntity brandEntity);

    void updateEntityFromRequest(AdminBrandRequestDTO adminBrandRequestDTO,
                                 @MappingTarget BrandEntity brandEntity);
}
