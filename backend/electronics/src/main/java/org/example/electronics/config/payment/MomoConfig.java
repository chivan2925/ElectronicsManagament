package org.example.electronics.config.payment;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MomoConfig {

    @Value("${payment.momo.partner-code}")
    private String partnerCode;

    @Value("${payment.momo.access-key}")
    private String accessKey;

    @Value("${payment.momo.secret-key}")
    private String secretKey;

    @Value("${payment.momo.endpoint}")
    private String endpoint;

    @Value("${payment.momo.refund-url}")
    private String refundUrl;

    @Value("${payment.momo.return-url}")
    private String returnUrl;

    @Value("${payment.momo.notify-url}")
    private String notifyUrl;

}