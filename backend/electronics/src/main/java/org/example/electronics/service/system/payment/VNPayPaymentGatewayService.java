package org.example.electronics.service.system.payment;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.VNPayConfig;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.monitoring.MonitoringLogger;
import org.example.electronics.util.payment.VNPayUtils;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayPaymentGatewayService implements PaymentGatewayService {

    private final VNPayConfig vnPayConfig;
    private final VNPayUtils vnPayUtils;

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.VNPAY;
    }

    @Override
    public PaymentLinkResponseDTO createPaymentLink(
            OrderEntity order,
            PaymentTransactionEntity transaction,
            HttpServletRequest request
    ) {
        assertSandbox();

        Map<String, String> vnpParams = vnPayConfig.getVNPayConfig();
        long amount = order.getTotal().setScale(0, RoundingMode.HALF_UP).longValue();

        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_IpAddr", VNPayUtils.getIpAddress(request));
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_TxnRef", String.valueOf(order.getId()));

        String paymentUrl = vnPayConfig.getVnp_PayUrl() +
                "?" +
                vnPayUtils.buildQueryString(vnpParams) +
                "&vnp_SecureHash=" +
                vnPayUtils.createSecureHash(vnpParams);

        MonitoringLogger.info(log, "payment.gateway.link_created", MonitoringLogger.fields(
                "amount", amount,
                "orderId", order.getId(),
                "provider", PaymentProvider.VNPAY,
                "transactionId", transaction.getId()
        ));

        return new PaymentLinkResponseDTO(
                paymentUrl,
                PaymentProvider.VNPAY,
                order.getId(),
                transaction.getId(),
                "pending",
                null,
                null,
                null,
                "VNPay sandbox payment URL created"
        );
    }

    private void assertSandbox() {
        String payUrl = vnPayConfig.getVnp_PayUrl();

        if (payUrl == null || !payUrl.contains("sandbox.vnpayment.vn")) {
            throw new IllegalStateException("Chỉ cho phép VNPay sandbox trong môi trường hiện tại");
        }
    }
}
