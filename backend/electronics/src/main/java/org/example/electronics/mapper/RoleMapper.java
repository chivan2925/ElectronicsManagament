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

    @Mapping(target = "permissionCount", expression = "java(roleEntity.getPermissions() == null ? 0 : roleEntity.getPermissions().size())")
    @Mapping(target = "staffCount", ignore = true)
    AdminRoleResponseDTO toAdminResponseDTO(RoleEntity roleEntity);

    @Mapping(target = "permissionCount", expression = "java(roleEntity.getPermissions() == null ? 0 : roleEntity.getPermissions().size())")
    @Mapping(target = "staffCount", ignore = true)
    AdminDetailRoleResponseDTO toAdminDetailResponseDTO(RoleEntity roleEntity);

    @Mapping(target = "permissions", ignore = true)
    void updateEntityFromRequest(AdminRoleRequestDTO adminRoleRequestDTO,
                                 @MappingTarget RoleEntity roleEntity);
}
