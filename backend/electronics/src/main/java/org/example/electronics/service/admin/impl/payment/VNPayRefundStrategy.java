package org.example.electronics.service.admin.impl.payment;

import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.VNPayConfig;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.example.electronics.util.payment.VNPayUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class VNPayRefundStrategy extends AbstractRefundStrategy {

    private final VNPayConfig vnPayConfig;
    private final RestTemplate restTemplate;

    public VNPayRefundStrategy(PaymentTransactionRepository paymentTransactionRepository, VNPayConfig vnPayConfig, RestTemplate restTemplate) {
        super(paymentTransactionRepository);

        this.vnPayConfig = vnPayConfig;
        this.restTemplate = restTemplate;
    }

    @Override
    public PaymentProvider getSupportedProvider() {
        return PaymentProvider.VNPAY;
    }

    @Override
    public void process(PaymentTransactionEntity originalTx, ReturnRequestEntity returnRequest, Integer staffId) {
        try {
            // Định dạng thời gian theo chuẩn VNPay yyyyMMddHHmmss
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String vnp_RequestId = VNPayUtils.getRandomNumber(8); // Tự viết thêm hàm này trong Utils để gen số ngẫu nhiên
            String vnp_Version = "2.1.0";
            String vnp_Command = "refund";
            String vnp_TmnCode = vnPayConfig.getVnp_TmnCode();
            String vnp_TransactionType = "02"; // 02: Hoàn toàn bộ tiền. (Nếu sếp muốn hoàn 1 phần thì dùng 03)
            String vnp_TxnRef = originalTx.getOrder().getId().toString();
            long amount = originalTx.getAmount().multiply(BigDecimal.valueOf(100)).longValue(); // VNPay bắt nhân 100
            String vnp_Amount = String.valueOf(amount);
            String vnp_OrderInfo = "Hoan tien cho don hang " + vnp_TxnRef;
            String vnp_TransactionNo = originalTx.getProviderPaymentId(); // RẤT QUAN TRỌNG: Mã giao dịch lúc khách quẹt thẻ
            String vnp_TransactionDate = originalTx.getPaymentTime().format(formatter); // Thời gian lúc mua hàng
            String vnp_CreateBy = "Admin_" + staffId;
            String vnp_CreateDate = LocalDateTime.now().format(formatter);
            String vnp_IpAddr = "127.0.0.1"; // Hoàn tiền ngầm trên server nên để IP server

            // Tạo chuỗi Hash (Tuyệt đối phải đúng thứ tự này theo tài liệu VNPay)
            String hashData = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" +
                    vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" +
                    vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

            String vnp_SecureHash = VNPayUtils.hmacSHA512(vnPayConfig.getSecretKey(), hashData);

            // Gói vào JSON
            Map<String, String> requestData = new HashMap<>();
            requestData.put("vnp_RequestId", vnp_RequestId);
            requestData.put("vnp_Version", vnp_Version);
            requestData.put("vnp_Command", vnp_Command);
            requestData.put("vnp_TmnCode", vnp_TmnCode);
            requestData.put("vnp_TransactionType", vnp_TransactionType);
            requestData.put("vnp_TxnRef", vnp_TxnRef);
            requestData.put("vnp_Amount", vnp_Amount);
            requestData.put("vnp_OrderInfo", vnp_OrderInfo);
            requestData.put("vnp_TransactionNo", vnp_TransactionNo);
            requestData.put("vnp_TransactionDate", vnp_TransactionDate);
            requestData.put("vnp_CreateBy", vnp_CreateBy);
            requestData.put("vnp_CreateDate", vnp_CreateDate);
            requestData.put("vnp_IpAddr", vnp_IpAddr);
            requestData.put("vnp_SecureHash", vnp_SecureHash);

            // Bắn HTTP POST sang VNPay
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestData, headers);

            log.info("Bắt đầu gửi lệnh Hoàn tiền sang VNPay cho mã đơn: {}", vnp_TxnRef);

            // Dùng exchange để khai báo rõ kiểu Generic Map<String, String>
            ResponseEntity<Map<String, String>> responseEntity = restTemplate.exchange(
                    vnPayConfig.getVnp_RefundUrl(),
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {
                    }
            );
            Map<String, String> response = responseEntity.getBody();

            log.info("Kết quả VNPay trả về: {}", response);

            // Kiểm tra kết quả
            if (response != null && "00".equals(response.get("vnp_ResponseCode"))) {
                // THÀNH CÔNG: Ghi nhận 1 dòng giao dịch Hoàn tiền vào Database
                saveRefundTransaction(originalTx, returnRequest, response.toString());
            } else {
                // THẤT BẠI
                String errMsg = response != null ? response.get("vnp_Message") : "Lỗi mạng kết nối VNPay";
                throw new RuntimeException("Hoàn tiền VNPay thất bại: " + errMsg);
            }

        } catch (Exception e) {
            log.error("Lỗi khi xử lý Refund VNPay: ", e);
            throw new RuntimeException("Hệ thống lỗi khi xử lý hoàn tiền: " + e.getMessage());
        }
    }
}
