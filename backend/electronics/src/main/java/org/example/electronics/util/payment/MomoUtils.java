package org.example.electronics.util.payment;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@Slf4j
public class MomoUtils {

    @Value("${electronics.app.momo.secretKey}")
    private String secretKey;

    @Value("${electronics.app.momo.accessKey}")
    private String accessKey;

    // 🚀 Vũ khí của Momo: HMAC-SHA256
    public static String hmacSHA256(String data, String secretKey) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi mã hóa dữ liệu Momo: " + e.getMessage());
        }
    }

    public boolean validateSignature(Map<String, Object> requestBody) {
        try {
            // Bóc tách các trường Momo gửi về
            String amount = String.valueOf(requestBody.get("amount"));
            String extraData = String.valueOf(requestBody.get("extraData"));
            String message = String.valueOf(requestBody.get("message"));
            String orderId = String.valueOf(requestBody.get("orderId"));
            String orderInfo = String.valueOf(requestBody.get("orderInfo"));
            String orderType = String.valueOf(requestBody.get("orderType"));
            String partnerCode = String.valueOf(requestBody.get("partnerCode"));
            String payType = String.valueOf(requestBody.get("payType"));
            String requestId = String.valueOf(requestBody.get("requestId"));
            String responseTime = String.valueOf(requestBody.get("responseTime"));
            String resultCode = String.valueOf(requestBody.get("resultCode"));
            String transId = String.valueOf(requestBody.get("transId"));

            // Chữ ký IPN của Momo bắt buộc phải nối chuỗi THEO ĐÚNG THỨ TỰ này
            String rawHash = "accessKey=" + accessKey +
                    "&amount=" + amount +
                    "&extraData=" + extraData +
                    "&message=" + message +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&orderType=" + orderType +
                    "&partnerCode=" + partnerCode +
                    "&payType=" + payType +
                    "&requestId=" + requestId +
                    "&responseTime=" + responseTime +
                    "&resultCode=" + resultCode +
                    "&transId=" + transId;

            // Mã băm bằng HMAC SHA256
            String mySignature = hmacSHA256(rawHash, secretKey);
            String momoSignature = String.valueOf(requestBody.get("signature"));

            // So sánh
            return mySignature.equals(momoSignature);

        } catch (Exception e) {
            log.error("Lỗi khi giải mã chữ ký Momo: {}", e.getMessage());
            return false;
        }
    }
}