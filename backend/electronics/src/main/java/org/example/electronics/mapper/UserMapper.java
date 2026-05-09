package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.AdminUserResponseDTO;
import org.example.electronics.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    AdminUserResponseDTO toAdminResponseDTO(UserEntity userEntity);
}
