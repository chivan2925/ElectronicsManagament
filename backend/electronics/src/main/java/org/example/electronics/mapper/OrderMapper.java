package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.order.AdminOrderDetailResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderItemResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderResponseDTO;
import org.example.electronics.entity.order.OrderDetailEntity;
import org.example.electronics.entity.order.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface OrderMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    AdminOrderResponseDTO toAdminResponseDTO(OrderEntity orderEntity);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "user.phoneNumber", target = "userPhoneNumber")
    @Mapping(source = "coupon.code", target = "couponCode")
    AdminOrderDetailResponseDTO toAdminDetailResponseDTO(OrderEntity orderEntity);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "variant.name", target = "variantName")
    AdminOrderItemResponseDTO toAdminItemResponseDTO(OrderDetailEntity orderDetailEntity);
}
