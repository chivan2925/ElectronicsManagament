package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.AdminReviewResponseDTO;
import org.example.electronics.entity.ReviewEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "order.id", target = "orderId")
    AdminReviewResponseDTO toAdminResponseDTO(ReviewEntity reviewEntity);
}
