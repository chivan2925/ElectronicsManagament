package org.example.electronics.service.system;

import jakarta.servlet.http.HttpServletRequest;
import org.example.electronics.dto.request.user.payment.CreatePaymentLinkRequestDTO;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.dto.response.user.payment.PaymentStatusResponseDTO;

import java.util.Map;

public interface SystemPaymentService {

    PaymentLinkResponseDTO createPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request);
    PaymentLinkResponseDTO createVNPayPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request);
    PaymentLinkResponseDTO createMomoPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request);
    PaymentStatusResponseDTO getOrderPaymentStatus(Integer orderId);
    PaymentStatusResponseDTO processVNPayReturn(Map<String, String> fields);
    PaymentStatusResponseDTO processMomoReturn(Map<String, Object> fields);
    String processVNPayIPN(Map<String, String> fields);
    void processMomoIPN(Map<String, Object> requestBody);
}
