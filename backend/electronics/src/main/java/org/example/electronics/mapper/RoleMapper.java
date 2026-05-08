package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.AdminRoleRequestDTO;
import org.example.electronics.dto.response.admin.role.AdminDetailRoleResponseDTO;
import org.example.electronics.dto.response.admin.role.AdminRoleResponseDTO;
import org.example.electronics.entity.RoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {PermissionMapper.class}
)
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    RoleEntity toNewEntity(AdminRoleRequestDTO adminRoleRequestDTO);

    AdminRoleResponseDTO toAdminResponseDTO(RoleEntity roleEntity);

    AdminDetailRoleResponseDTO toAdminDetailResponseDTO(RoleEntity roleEntity);

    @Mapping(target = "permissions", ignore = true)
    void updateEntityFromRequest(AdminRoleRequestDTO adminRoleRequestDTO,
                                 @MappingTarget RoleEntity roleEntity);
}
