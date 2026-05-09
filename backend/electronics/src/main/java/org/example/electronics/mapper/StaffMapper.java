package org.example.electronics.mapper;

import org.example.electronics.dto.request.admin.staff.AdminCreateStaffRequestDTO;
import org.example.electronics.dto.request.admin.staff.AdminUpdateStaffRequestDTO;
import org.example.electronics.dto.response.admin.AdminStaffResponseDTO;
import org.example.electronics.entity.StaffEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface StaffMapper {

    @Mapping(target = "role", ignore = true)
    @Mapping(target = "hashedPassword", ignore = true)
    StaffEntity toNewEntity(AdminCreateStaffRequestDTO adminCreateStaffRequestDTO);

    @Mapping(source = "role.id", target = "roleId")
    @Mapping(source = "role.name", target = "roleName")
    @Mapping(target = "rawPassword", ignore = true)
    AdminStaffResponseDTO toAdminResponseDTO(StaffEntity staffEntity);

    AdminStaffResponseDTO toAdminResponseDTOWithPassword(StaffEntity entity, String rawPassword);

    @Mapping(target = "role", ignore = true)
    void updateEntityFromRequest(AdminUpdateStaffRequestDTO adminUpdateStaffRequestDTO,
                                 @MappingTarget StaffEntity staffEntity);
}
