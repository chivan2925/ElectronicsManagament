package org.example.electronics.util.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class VNPayUtils {

    @Value("${electronics.app.vnpay.secretKey}")
    private String secretKey;

    // 🚀 Vũ khí 1: Thuật toán băm HMAC-SHA512 (Chuẩn tài liệu VNPay)
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            throw new RuntimeException("Lỗi mã hóa dữ liệu VNPay: " + ex.getMessage());
        }
    }

    // 🚀 Vũ khí 2: Lấy IP thật của khách hàng (Bắt buộc phải có để chống gian lận)
    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getRemoteAddr();
            }
            // Trong trường hợp dùng localhost nó sẽ trả về 0:0:0:0:0:0:0:1, VNPay không chịu cái này
            if (ipAddress != null && ipAddress.equals("0:0:0:0:0:0:0:1")) {
                ipAddress = "127.0.0.1";
            }
            // Nếu qua nhiều Proxy thì lấy IP đầu tiên
            if (ipAddress != null && ipAddress.length() > 15 && ipAddress.indexOf(",") > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
            }
        } catch (Exception e) {
            ipAddress = "Invalid IP";
        }
        return ipAddress;
    }

    // 🚀 Vũ khí 3: Sinh chuỗi số ngẫu nhiên (Dùng để tạo vnp_RequestId cho luồng Hoàn tiền)
    public static String getRandomNumber(int length) {
        Random random = new Random();
        String chars = "0123456789";
        StringBuilder stringBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            stringBuilder.append(chars.charAt(random.nextInt(chars.length())));
        }

        return stringBuilder.toString();
    }

    public boolean validateSignature(Map<String, String> fields, String vnpSecureHash) {
        try {
            // 1. Tạo danh sách các key và sắp xếp theo bảng chữ cái (Bắt buộc theo chuẩn VNPay)
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            // 2. Ghép chuỗi HashData
            StringBuilder hashData = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    // Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                    // Thêm '&' nếu chưa phải là tham số cuối cùng
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            // 3. Băm chuỗi HashData với SecretKey
            String secureHash = hmacSHA512(secretKey, hashData.toString());

            // 4. So sánh mã băm của mình với mã VNPay gửi về
            return secureHash.equals(vnpSecureHash);

        } catch (Exception e) {
            return false;
        }
    }
}