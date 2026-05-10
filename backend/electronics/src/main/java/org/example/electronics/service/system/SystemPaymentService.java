package org.example.electronics.service.system;

import jakarta.servlet.http.HttpServletRequest;
import org.example.electronics.dto.request.user.payment.CreatePaymentLinkRequestDTO;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.dto.response.user.payment.PaymentStatusResponseDTO;

import java.util.Map;

public interface SystemPaymentService {

    PaymentLinkResponseDTO createVNPayPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request);
    PaymentStatusResponseDTO getOrderPaymentStatus(Integer orderId);
    PaymentStatusResponseDTO processVNPayReturn(Map<String, String> fields);
    String processVNPayIPN(Map<String, String> fields);
    void processMomoIPN(Map<String, Object> requestBody);
}
