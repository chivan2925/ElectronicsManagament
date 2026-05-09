package org.example.electronics.controller.system;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.service.system.SystemPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system/payment")
@RequiredArgsConstructor
@Slf4j
public class SystemPaymentTransactionController {

    private final SystemPaymentService systemPaymentService;

    @GetMapping("/vnpay-ipn")
    @Operation(summary = "VNPay IPN Webhook", description = "Dành riêng cho server VNPay gọi ngầm để cập nhật trạng thái")
    public ResponseEntity<?> vnpayIPN(HttpServletRequest request) {
        try {
            // Lấy toàn bộ tham số VNPay gửi về
            Map<String, String> fields = new HashMap<>();
            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    fields.put(fieldName, fieldValue);
                }
            }

            // Gọi Service để xử lý
            String responseCode = systemPaymentService.processVNPayIPN(fields);

            // ⚠️ QUAN TRỌNG: VNPay bắt buộc phải trả về JSON format này, nếu không nó sẽ gọi lại API của sếp liên tục!
            return ResponseEntity.ok(Map.of(
                    "RspCode", responseCode,
                    "Message", responseCode.equals("00") ? "Confirm Success" : "Error"
            ));

        } catch (Exception e) {
            log.error("Lỗi IPN: ", e);
            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }

    @PostMapping("/momo-ipn")
    @Operation(summary = "Momo IPN Webhook", description = "Dành riêng cho server Momo gọi ngầm (POST JSON) để cập nhật trạng thái")
    public ResponseEntity<Void> momoIPN(@RequestBody Map<String, Object> requestBody) {
        try {
            // Momo không cần trả về JSON rườm rà như VNPay.
            // Chỉ cần HTTP Status 204 (No Content) hoặc 200 (OK) là nó biết sếp đã nhận được.
            systemPaymentService.processMomoIPN(requestBody);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Lỗi Momo IPN: ", e);
            // Kể cả lỗi cũng nên trả về 204/200 để Momo không gọi lại spam server,
            // lỗi thì mình tự ghi log xử lý sau.
            return ResponseEntity.noContent().build();
        }
    }
}
