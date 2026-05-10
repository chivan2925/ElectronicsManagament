package org.example.electronics.service.system.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.order.OrderEntity;

public interface PaymentGatewayService {

    PaymentProvider getProvider();

    PaymentLinkResponseDTO createPaymentLink(
            OrderEntity order,
            PaymentTransactionEntity transaction,
            HttpServletRequest request
    );
}
