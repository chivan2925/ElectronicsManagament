package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.AdminAddressResponseDTO;
import org.example.electronics.entity.AddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    @Mapping(source = "user.id", target = "userId")
    AdminAddressResponseDTO toAdminResponseDTO(AddressEntity addressEntity);
}
