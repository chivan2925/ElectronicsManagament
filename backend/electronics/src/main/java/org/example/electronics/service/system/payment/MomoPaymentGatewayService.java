package org.example.electronics.service.system.payment;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.MomoConfig;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.util.payment.MomoUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoPaymentGatewayService implements PaymentGatewayService {

    private static final String EXTRA_DATA = "";
    private static final String LANG = "vi";
    private static final String REQUEST_TYPE = "captureWallet";

    private final MomoConfig momoConfig;
    private final RestTemplate restTemplate;

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.MOMO;
    }

    @Override
    public PaymentLinkResponseDTO createPaymentLink(
            OrderEntity order,
            PaymentTransactionEntity transaction,
            HttpServletRequest request
    ) {
        assertSandbox();

        String providerOrderId = buildProviderOrderId(order, transaction);
        String requestId = "MOMO-" + transaction.getId() + "-" + System.currentTimeMillis();
        long amount = order.getTotal().setScale(0, RoundingMode.HALF_UP).longValue();
        String amountText = String.valueOf(amount);
        String orderInfo = "Thanh toan don hang " + order.getCode();

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("partnerCode", momoConfig.getPartnerCode());
        requestData.put("partnerName", "ElectronicsManagement");
        requestData.put("storeId", "ElectronicsManagement");
        requestData.put("requestId", requestId);
        requestData.put("amount", amount);
        requestData.put("orderId", providerOrderId);
        requestData.put("orderInfo", orderInfo);
        requestData.put("redirectUrl", momoConfig.getReturnUrl());
        requestData.put("ipnUrl", momoConfig.getNotifyUrl());
        requestData.put("lang", LANG);
        requestData.put("requestType", REQUEST_TYPE);
        requestData.put("autoCapture", true);
        requestData.put("extraData", EXTRA_DATA);
        requestData.put("signature", MomoUtils.hmacSHA256(buildCreatePaymentRawHash(
                amountText,
                EXTRA_DATA,
                momoConfig.getNotifyUrl(),
                providerOrderId,
                orderInfo,
                momoConfig.getPartnerCode(),
                momoConfig.getReturnUrl(),
                requestId,
                REQUEST_TYPE
        ), momoConfig.getSecretKey()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestData, headers);

        ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                momoConfig.getEndpoint(),
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        Map<String, Object> response = responseEntity.getBody();
        if (response == null) {
            throw new IllegalStateException("MoMo sandbox không trả dữ liệu tạo thanh toán");
        }

        transaction.setPayloadJson(Map.of(
                "request", requestData,
                "response", response
        ));

        String resultCode = valueOf(response.get("resultCode"));
        String paymentUrl = valueOf(response.get("payUrl"));

        if (!"0".equals(resultCode) || paymentUrl.isBlank()) {
            throw new IllegalStateException("MoMo sandbox tạo thanh toán thất bại: " + valueOf(response.get("message")));
        }

        log.info("MoMo sandbox payment URL created for order {}", order.getId());

        return new PaymentLinkResponseDTO(
                paymentUrl,
                PaymentProvider.MOMO,
                order.getId(),
                transaction.getId(),
                "pending",
                valueOf(response.get("deeplink")),
                valueOf(response.get("qrCodeUrl")),
                resultCode,
                valueOf(response.get("message"))
        );
    }

    private String buildCreatePaymentRawHash(
            String amount,
            String extraData,
            String ipnUrl,
            String orderId,
            String orderInfo,
            String partnerCode,
            String redirectUrl,
            String requestId,
            String requestType
    ) {
        return "accessKey=" + momoConfig.getAccessKey() +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;
    }

    private String buildProviderOrderId(OrderEntity order, PaymentTransactionEntity transaction) {
        return "ORDER-" + order.getId() + "-TX-" + transaction.getId();
    }

    private String valueOf(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private void assertSandbox() {
        String endpoint = momoConfig.getEndpoint();

        if (endpoint == null || !endpoint.contains("test-payment.momo.vn")) {
            throw new IllegalStateException("Chỉ cho phép MoMo sandbox trong môi trường hiện tại");
        }
    }
}
