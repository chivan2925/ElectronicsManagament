package org.example.electronics.config.payment;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Configuration
@Getter
public class VNPayConfig {

    // @Value sẽ tự động đọc dữ liệu từ file application.yml lên đây
    @Value("${payment.vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${payment.vnpay.secret-key}")
    private String secretKey;

    @Value("${payment.vnpay.pay-url}")
    private String vnp_PayUrl;

    @Value("${payment.vnpay.refund-url}")
    private String vnp_RefundUrl;

    @Value("${payment.vnpay.return-url}")
    private String vnp_ReturnUrl;

    // 🚀 Vũ khí bí mật: Hàm tự động build các tham số mặc định
    public Map<String, String> getVNPayConfig() {
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", "2.1.0"); // Phiên bản API mới nhất
        vnpParamsMap.put("vnp_Command", "pay"); // Lệnh thanh toán
        vnpParamsMap.put("vnp_TmnCode", this.vnp_TmnCode);
        vnpParamsMap.put("vnp_CurrCode", "VND"); // Chỉ hỗ trợ VND
        vnpParamsMap.put("vnp_Locale", "vn"); // Ngôn ngữ tiếng Việt
        vnpParamsMap.put("vnp_ReturnUrl", this.vnp_ReturnUrl);

        // Xử lý múi giờ chuẩn VN (GMT+7)
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_CreateDate", vnpCreateDate);

        // Quy định thời gian link thanh toán sống được bao lâu (Ví dụ: 15 phút)
        calendar.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_ExpireDate", vnp_ExpireDate);

        return vnpParamsMap;
    }
}