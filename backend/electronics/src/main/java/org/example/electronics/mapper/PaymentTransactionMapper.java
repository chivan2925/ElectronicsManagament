package org.example.electronics.mapper;

import org.example.electronics.dto.response.admin.AdminPaymentTransactionResponseDTO;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentTransactionMapper {

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "returnRequest.id", target = "returnRequestId")
    AdminPaymentTransactionResponseDTO toAdminResponseDTO(PaymentTransactionEntity paymentTransactionEntity);
}
