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

    @Value("${electronics.app.momo.secretKey:${payment.momo.secret-key:}}")
    private String secretKey;

    @Value("${electronics.app.momo.accessKey:${payment.momo.access-key:}}")
    private String accessKey;

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
            if (requestBody == null) {
                return false;
            }

            String momoSignature = valueOf(requestBody.get("signature"));
            if (momoSignature.isBlank()) {
                return false;
            }

            String rawHash = buildCallbackRawHash(requestBody);
            String mySignature = hmacSHA256(rawHash, secretKey);

            return mySignature.equalsIgnoreCase(momoSignature);

        } catch (Exception e) {
            log.error("Lỗi khi giải mã chữ ký Momo: {}", e.getMessage());
            return false;
        }
    }

    private String buildCallbackRawHash(Map<String, Object> requestBody) {
        return "accessKey=" + accessKey +
                "&amount=" + valueOf(requestBody.get("amount")) +
                "&extraData=" + valueOf(requestBody.get("extraData")) +
                "&message=" + valueOf(requestBody.get("message")) +
                "&orderId=" + valueOf(requestBody.get("orderId")) +
                "&orderInfo=" + valueOf(requestBody.get("orderInfo")) +
                "&orderType=" + valueOf(requestBody.get("orderType")) +
                "&partnerCode=" + valueOf(requestBody.get("partnerCode")) +
                "&payType=" + valueOf(requestBody.get("payType")) +
                "&requestId=" + valueOf(requestBody.get("requestId")) +
                "&responseTime=" + valueOf(requestBody.get("responseTime")) +
                "&resultCode=" + valueOf(requestBody.get("resultCode")) +
                "&transId=" + valueOf(requestBody.get("transId"));
    }

    private String valueOf(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
