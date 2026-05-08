package org.example.electronics.service.admin.impl.payment;

import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.MomoConfig;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.example.electronics.util.payment.MomoUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class MomoRefundStrategy extends AbstractRefundStrategy {

    private final MomoConfig momoConfig;

    private final RestTemplate restTemplate;

    public MomoRefundStrategy(PaymentTransactionRepository paymentTransactionRepository, MomoConfig momoConfig, RestTemplate restTemplate) {
        super(paymentTransactionRepository);

        this.momoConfig = momoConfig;
        this.restTemplate = restTemplate;
    }

    @Override
    public PaymentProvider getSupportedProvider() {
        return PaymentProvider.MOMO;
    }

    @Override
    public void process(PaymentTransactionEntity originalTx, ReturnRequestEntity returnRequest, Integer staffId) {
        try {
            // Momo yêu cầu 1 mã OrderId riêng biệt cho giao dịch hoàn tiền này (không được trùng với lúc mua)
            String refundOrderId = "REFUND_" + originalTx.getOrder().getId() + "_" + System.currentTimeMillis();
            String requestId = String.valueOf(System.currentTimeMillis());

            // Số tiền hoàn. Khác với VNPay (bắt nhân 100), Momo dùng tiền VNĐ chuẩn
            long amount = originalTx.getAmount().longValue();
            String description = "Hoan tien don hang " + originalTx.getOrder().getId() + " boi Admin_" + staffId;

            // providerPaymentId chính là transId (Mã giao dịch của Momo) lưu lúc khách thanh toán thành công
            Long transId = Long.parseLong(originalTx.getProviderPaymentId());

            // 1. Tạo chuỗi Hash (BẮT BUỘC sắp xếp theo Alphabet A-Z)
            String rawHash = "accessKey=" + momoConfig.getAccessKey() +
                    "&amount=" + amount +
                    "&description=" + description +
                    "&orderId=" + refundOrderId +
                    "&partnerCode=" + momoConfig.getPartnerCode() +
                    "&requestId=" + requestId +
                    "&transId=" + transId;

            // 2. Ký bảo mật bằng HMAC-SHA256
            String signature = MomoUtils.hmacSHA256(rawHash, momoConfig.getSecretKey());

            // 3. Gói data vào JSON Map
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("partnerCode", momoConfig.getPartnerCode());
            requestData.put("orderId", refundOrderId);
            requestData.put("requestId", requestId);
            requestData.put("amount", amount);
            requestData.put("transId", transId);
            requestData.put("lang", "vi");
            requestData.put("description", description);
            requestData.put("signature", signature);

            // 4. Bắn HTTP POST sang Momo
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestData, headers);

            log.info("Bắt đầu gửi lệnh Hoàn tiền sang Momo cho mã đơn gốc: {}", originalTx.getOrder().getId());

            // Dùng exchange để khai báo rõ kiểu Generic Map<String, Object>
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                    momoConfig.getRefundUrl(),
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );
            Map<String, Object> response = responseEntity.getBody();

            log.info("Kết quả Momo trả về: {}", response);

            // 5. Đọc kết quả từ Momo (resultCode = 0 là thành công)
            if (response != null && Integer.valueOf(0).equals(response.get("resultCode"))) {
                // THÀNH CÔNG: Ghi nhận vào Database
                saveRefundTransaction(originalTx, returnRequest, response.toString());
            } else {
                // THẤT BẠI
                String errMsg = response != null ? (String) response.get("message") : "Lỗi mạng kết nối Momo";
                throw new RuntimeException("Hoàn tiền Momo thất bại: " + errMsg);
            }

        } catch (Exception e) {
            log.error("Lỗi khi xử lý Refund Momo: ", e);
            throw new RuntimeException("Hệ thống lỗi khi xử lý hoàn tiền Momo: " + e.getMessage());
        }
    }
}
