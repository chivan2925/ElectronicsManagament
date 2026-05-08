package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.AdminPermissionResponseDTO;
import org.example.electronics.entity.PermissionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PermissionMapper {

    AdminPermissionResponseDTO toAdminResponseDTO(PermissionEntity permissionEntity);
}
