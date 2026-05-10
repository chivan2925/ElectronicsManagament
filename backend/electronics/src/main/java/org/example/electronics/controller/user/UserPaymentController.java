package org.example.electronics.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.VNPayConfig;
import org.example.electronics.dto.request.user.payment.CreatePaymentLinkRequestDTO;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.dto.response.user.payment.PaymentStatusResponseDTO;
import org.example.electronics.service.system.SystemPaymentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User - Payments", description = "Payment handoff APIs for storefront checkout")
public class UserPaymentController {

    private final SystemPaymentService systemPaymentService;
    private final VNPayConfig vnPayConfig;

    @PostMapping("/vnpay/create")
    @Operation(
            summary = "Create VNPay sandbox payment URL",
            description = "Creates a signed VNPay sandbox payment URL for a pending digital order."
    )
    public ResponseEntity<PaymentLinkResponseDTO> createVNPayPaymentUrl(
            @Valid @RequestBody CreatePaymentLinkRequestDTO requestDTO,
            HttpServletRequest request
    ) {
        PaymentLinkResponseDTO responseDTO = systemPaymentService.createVNPayPaymentLink(requestDTO, request);

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/vnpay-return")
    @Operation(
            summary = "Handle VNPay browser return",
            description = "Validates VNPay return signature, updates payment state, and redirects back to the storefront result page."
    )
    public ResponseEntity<Void> handleVNPayReturn(HttpServletRequest request) {
        try {
            PaymentStatusResponseDTO responseDTO = systemPaymentService.processVNPayReturn(extractRequestParams(request));

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, responseDTO.redirectUrl())
                    .build();
        } catch (Exception exception) {
            log.error("VNPay return handling failed", exception);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(vnPayConfig.getFrontendFailedUrl() + "?status=failed&verified=false"))
                    .build();
        }
    }

    @GetMapping("/orders/{orderId}/status")
    @Operation(
            summary = "Verify order payment status",
            description = "Returns the server-side payment and transaction status for a customer order."
    )
    public ResponseEntity<PaymentStatusResponseDTO> getPaymentStatus(@PathVariable Integer orderId) {
        return ResponseEntity.ok(systemPaymentService.getOrderPaymentStatus(orderId));
    }

    private Map<String, String> extractRequestParams(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();

        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(fieldName, fieldValue);
            }
        }

        return fields;
    }
}
