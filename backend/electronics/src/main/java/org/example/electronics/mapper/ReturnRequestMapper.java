package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.returnrequest.AdminDetailReturnRequestResponseDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminReturnRequestResponseDTO;
import org.example.electronics.entity.ReturnRequestEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReturnRequestMapper {


    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "handledByStaff.id", target = "handledByStaffId")
    AdminReturnRequestResponseDTO toAdminResponseDTO(ReturnRequestEntity returnRequestEntity);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "user.phoneNumber", target = "userPhoneNumber")
    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "handledByStaff.id", target = "handledByStaffId")
    AdminDetailReturnRequestResponseDTO toAdminDetailResponseDTO(ReturnRequestEntity returnRequestEntity);
}
