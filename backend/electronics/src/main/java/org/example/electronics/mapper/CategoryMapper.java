package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.AdminCategoryRequestDTO;
import org.example.electronics.dto.response.admin.category.AdminCategoryResponseDTO;
import org.example.electronics.dto.response.admin.category.AdminDetailCategoryResponseDTO;
import org.example.electronics.entity.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    @Mapping(source = "parentId", target = "parent.id")
    CategoryEntity toNewEntity(AdminCategoryRequestDTO adminCategoryRequestDTO);

    AdminCategoryResponseDTO toAdminResponseDTO(CategoryEntity categoryEntity);

    @Mapping(source = "parent.id", target = "parentId")
    @Mapping(source = "parent.name", target = "parentName")
    AdminDetailCategoryResponseDTO toAdminDetailResponseDTO(CategoryEntity categoryEntity);

    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "subCategoryList", ignore = true)
    void updateEntityFromRequest(AdminCategoryRequestDTO adminCategoryRequestDTO,
                                 @MappingTarget CategoryEntity categoryEntity);
}
