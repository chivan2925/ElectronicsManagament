package org.example.electronics.service.system.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.VNPayConfig;
import org.example.electronics.dto.request.user.payment.CreatePaymentLinkRequestDTO;
import org.example.electronics.dto.response.user.payment.PaymentLinkResponseDTO;
import org.example.electronics.dto.response.user.payment.PaymentStatusResponseDTO;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentMethodType;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.repository.OrderRepository;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.example.electronics.service.system.SystemOrderService;
import org.example.electronics.service.system.SystemPaymentService;
import org.example.electronics.util.payment.MomoUtils;
import org.example.electronics.util.payment.VNPayUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemPaymentServiceImpl implements SystemPaymentService {

    private static final DateTimeFormatter VNPAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final String VNPAY_SUCCESS_CODE = "00";
    private static final String VNPAY_CANCEL_CODE = "24";

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OrderRepository orderRepository;
    private final SystemOrderService systemOrderService;
    private final VNPayConfig vnPayConfig;
    private final VNPayUtils vnPayUtils;
    private final MomoUtils momoUtils;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentLinkResponseDTO createVNPayPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request) {
        assertSandboxVNPay();

        if (requestDTO.provider() != PaymentProvider.VNPAY) {
            throw new IllegalArgumentException("Chỉ hỗ trợ tạo link thanh toán VNPay sandbox ở endpoint này");
        }

        OrderEntity order = orderRepository.findOrderByIdWithDetails(requestDTO.orderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với id: " + requestDTO.orderId()));

        if (order.getStatus() != OrderStatus.PENDING || order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Chỉ đơn hàng đang chờ thanh toán mới có thể tạo link VNPay");
        }

        if (order.getPaymentMethodType() != PaymentMethodType.DIGITAL) {
            throw new IllegalStateException("Đơn hàng không được cấu hình phương thức thanh toán online");
        }

        PaymentTransactionEntity transaction = paymentTransactionRepository
                .findTopByOrderIdAndTypeAndProviderOrderByCreatedAtDesc(
                        order.getId(),
                        PaymentTransactionType.PAYMENT,
                        PaymentProvider.VNPAY
                )
                .filter((existingTransaction) -> existingTransaction.getStatus() == PaymentTransactionStatus.PENDING)
                .orElseGet(() -> PaymentTransactionEntity.builder()
                        .order(order)
                        .type(PaymentTransactionType.PAYMENT)
                        .provider(PaymentProvider.VNPAY)
                        .status(PaymentTransactionStatus.PENDING)
                        .build());

        transaction.setAmount(order.getTotal());
        transaction.setNote("VNPay sandbox payment link created for order " + order.getCode());
        transaction = paymentTransactionRepository.save(transaction);

        String paymentUrl = buildVNPayPaymentUrl(order, request);

        return new PaymentLinkResponseDTO(
                paymentUrl,
                PaymentProvider.VNPAY,
                order.getId(),
                transaction.getId(),
                "pending"
        );
    }

    @Transactional(readOnly = true)
    @Override
    public PaymentStatusResponseDTO getOrderPaymentStatus(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với id: " + orderId));

        PaymentTransactionEntity transaction = findVNPayPaymentTransaction(order.getId());

        return buildPaymentResponse(order, transaction, null, "Trạng thái thanh toán hiện tại", true, null);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentStatusResponseDTO processVNPayReturn(Map<String, String> fields) {
        return handleVNPayCallback(fields).response();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public String processVNPayIPN(Map<String, String> fields) {
        return handleVNPayCallback(fields).rspCode();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void processMomoIPN(Map<String, Object> requestBody) {
        boolean isValidSignature = momoUtils.validateSignature(requestBody);
        if (!isValidSignature) {
            log.warn("Momo IPN: Sai chữ ký bảo mật! Dữ liệu có thể bị giả mạo.");
            return;
        }

        String orderIdStr = String.valueOf(requestBody.get("orderId"));
        int resultCode = (int) requestBody.get("resultCode");
        long amount = Long.parseLong(String.valueOf(requestBody.get("amount")));

        OrderEntity order = orderRepository.findById(Integer.parseInt(orderIdStr)).orElse(null);
        if (order == null) {
            log.error("Momo IPN: Không tìm thấy Order ID {}", orderIdStr);
            return;
        }

        PaymentTransactionEntity transaction = paymentTransactionRepository.findByOrderId(order.getId()).orElse(null);
        if (transaction == null) {
            log.error("Momo IPN: Không tìm thấy Transaction cho Order ID {}", orderIdStr);
            return;
        }

        if (transaction.getStatus() == PaymentTransactionStatus.SUCCESS) {
            log.info("Momo IPN: Giao dịch này đã được xử lý thành công từ trước.");
            return;
        }

        if (transaction.getAmount().longValue() != amount) {
            log.error("Momo IPN: Số tiền không khớp! DB: {}, Momo gửi: {}", transaction.getAmount(), amount);
            return;
        }

        if (resultCode == 0) {
            transaction.setStatus(PaymentTransactionStatus.SUCCESS);
            transaction.setPaymentTime(LocalDateTime.now());
            systemOrderService.confirmSuccessfulPayment(order.getId());
            log.info("Momo IPN: Xử lý thành công đơn hàng {}", orderIdStr);
        } else {
            transaction.setStatus(PaymentTransactionStatus.FAILED);
            systemOrderService.closeUnpaidOrder(order.getId(), PaymentStatus.FAILED, "Thanh toán Momo thất bại.");
            log.info("Momo IPN: Thanh toán thất bại cho đơn hàng {}. ResultCode: {}", orderIdStr, resultCode);
        }

        paymentTransactionRepository.save(transaction);
    }

    private VNPayCallbackResult handleVNPayCallback(Map<String, String> rawFields) {
        Map<String, String> signedFields = new HashMap<>(rawFields);
        String secureHash = signedFields.remove("vnp_SecureHash");
        signedFields.remove("vnp_SecureHashType");

        Integer orderId = parseOrderId(signedFields.get("vnp_TxnRef"));
        String responseCode = signedFields.get("vnp_ResponseCode");

        if (secureHash == null || !vnPayUtils.validateSignature(signedFields, secureHash)) {
            return new VNPayCallbackResult(
                    "97",
                    buildPaymentResponse(null, null, responseCode, "Chữ ký VNPay không hợp lệ", false, orderId)
            );
        }

        if (!Objects.equals(signedFields.get("vnp_TmnCode"), vnPayConfig.getVnp_TmnCode())) {
            return new VNPayCallbackResult(
                    "97",
                    buildPaymentResponse(null, null, responseCode, "Mã merchant VNPay không hợp lệ", false, orderId)
            );
        }

        if (orderId == null) {
            return new VNPayCallbackResult(
                    "01",
                    buildPaymentResponse(null, null, responseCode, "Mã đơn hàng VNPay không hợp lệ", false, null)
            );
        }

        OrderEntity order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return new VNPayCallbackResult(
                    "01",
                    buildPaymentResponse(null, null, responseCode, "Không tìm thấy đơn hàng", false, orderId)
            );
        }

        PaymentTransactionEntity transaction = findVNPayPaymentTransaction(order.getId());
        if (transaction == null) {
            return new VNPayCallbackResult(
                    "01",
                    buildPaymentResponse(order, null, responseCode, "Không tìm thấy giao dịch thanh toán", false, orderId)
            );
        }

        BigDecimal callbackAmount = parseVNPayAmount(signedFields.get("vnp_Amount"));
        if (callbackAmount == null || !sameVndAmount(transaction.getAmount(), callbackAmount)) {
            return new VNPayCallbackResult(
                    "04",
                    buildPaymentResponse(order, transaction, responseCode, "Số tiền thanh toán không khớp", false, orderId)
            );
        }

        if (transaction.getStatus() == PaymentTransactionStatus.SUCCESS) {
            return new VNPayCallbackResult(
                    "02",
                    buildPaymentResponse(order, transaction, responseCode, "Giao dịch đã được ghi nhận trước đó", true, orderId)
            );
        }

        if (transaction.getStatus() == PaymentTransactionStatus.FAILED ||
                transaction.getStatus() == PaymentTransactionStatus.CANCELLED) {
            return new VNPayCallbackResult(
                    "00",
                    buildPaymentResponse(order, transaction, responseCode, "Giao dịch đã ở trạng thái cuối", true, orderId)
            );
        }

        transaction.setPayloadJson(toPayloadJson(rawFields));
        transaction.setPaymentTime(parseVNPayDate(signedFields.get("vnp_PayDate")));

        if (isSuccessfulVNPayPayment(signedFields)) {
            transaction.setStatus(PaymentTransactionStatus.SUCCESS);
            transaction.setProviderPaymentId(signedFields.get("vnp_TransactionNo"));
            systemOrderService.confirmSuccessfulPayment(order.getId());
            log.info("VNPay callback: Xử lý thành công đơn hàng {}", order.getId());
        } else if (VNPAY_CANCEL_CODE.equals(responseCode)) {
            transaction.setStatus(PaymentTransactionStatus.CANCELLED);
            systemOrderService.closeUnpaidOrder(order.getId(), PaymentStatus.CANCELLED, "Khách hàng đã hủy thanh toán VNPay.");
            log.info("VNPay callback: Khách hàng hủy thanh toán đơn hàng {}", order.getId());
        } else {
            transaction.setStatus(PaymentTransactionStatus.FAILED);
            systemOrderService.closeUnpaidOrder(order.getId(), PaymentStatus.FAILED, "Thanh toán VNPay thất bại. Mã phản hồi: " + responseCode);
            log.info("VNPay callback: Thanh toán thất bại cho đơn hàng {}. ResponseCode: {}", order.getId(), responseCode);
        }

        paymentTransactionRepository.save(transaction);

        return new VNPayCallbackResult(
                "00",
                buildPaymentResponse(order, transaction, responseCode, "Đã xác minh phản hồi VNPay", true, orderId)
        );
    }

    private String buildVNPayPaymentUrl(OrderEntity order, HttpServletRequest request) {
        Map<String, String> vnpParams = vnPayConfig.getVNPayConfig();
        long amount = order.getTotal().setScale(0, RoundingMode.HALF_UP).longValue();

        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_IpAddr", VNPayUtils.getIpAddress(request));
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_TxnRef", String.valueOf(order.getId()));

        return vnPayConfig.getVnp_PayUrl() +
                "?" +
                vnPayUtils.buildQueryString(vnpParams) +
                "&vnp_SecureHash=" +
                vnPayUtils.createSecureHash(vnpParams);
    }

    private PaymentTransactionEntity findVNPayPaymentTransaction(Integer orderId) {
        return paymentTransactionRepository
                .findTopByOrderIdAndTypeAndProviderOrderByCreatedAtDesc(
                        orderId,
                        PaymentTransactionType.PAYMENT,
                        PaymentProvider.VNPAY
                )
                .orElse(null);
    }

    private PaymentStatusResponseDTO buildPaymentResponse(
            OrderEntity order,
            PaymentTransactionEntity transaction,
            String responseCode,
            String message,
            boolean verified,
            Integer fallbackOrderId
    ) {
        Integer orderId = order != null ? order.getId() : fallbackOrderId;
        String status = resolveClientPaymentStatus(order, transaction, verified);
        String redirectUrl = buildFrontendRedirectUrl(status, orderId, transaction, responseCode, verified, message);

        return new PaymentStatusResponseDTO(
                orderId,
                order != null ? order.getCode() : null,
                transaction != null ? transaction.getId() : null,
                transaction != null ? transaction.getProvider() : PaymentProvider.VNPAY,
                status,
                order != null ? order.getPaymentStatus() : null,
                transaction != null ? transaction.getStatus() : null,
                transaction != null ? transaction.getAmount() : null,
                transaction != null ? transaction.getProviderPaymentId() : null,
                responseCode,
                message,
                verified,
                redirectUrl
        );
    }

    private String buildFrontendRedirectUrl(
            String status,
            Integer orderId,
            PaymentTransactionEntity transaction,
            String responseCode,
            boolean verified,
            String message
    ) {
        String baseUrl = "paid".equals(status) ? vnPayConfig.getFrontendSuccessUrl() : vnPayConfig.getFrontendFailedUrl();

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("status", status)
                .queryParam("provider", PaymentProvider.VNPAY.name())
                .queryParam("verified", verified);

        if (orderId != null) {
            builder.queryParam("orderId", orderId);
        }

        if (transaction != null) {
            builder.queryParam("transactionId", transaction.getId());
        }

        if (responseCode != null) {
            builder.queryParam("code", responseCode);
        }

        if (message != null) {
            builder.queryParam("message", message);
        }

        return builder.build().encode().toUriString();
    }

    private String resolveClientPaymentStatus(OrderEntity order, PaymentTransactionEntity transaction, boolean verified) {
        if (!verified) {
            return "failed";
        }

        if (transaction != null) {
            if (transaction.getStatus() == PaymentTransactionStatus.SUCCESS) {
                return "paid";
            }

            if (transaction.getStatus() == PaymentTransactionStatus.FAILED) {
                return "failed";
            }

            if (transaction.getStatus() == PaymentTransactionStatus.CANCELLED) {
                return "cancelled";
            }
        }

        if (order != null) {
            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                return "paid";
            }

            if (order.getPaymentStatus() == PaymentStatus.FAILED) {
                return "failed";
            }

            if (order.getPaymentStatus() == PaymentStatus.CANCELLED) {
                return "cancelled";
            }
        }

        return "pending";
    }

    private boolean isSuccessfulVNPayPayment(Map<String, String> fields) {
        String transactionStatus = fields.get("vnp_TransactionStatus");

        return VNPAY_SUCCESS_CODE.equals(fields.get("vnp_ResponseCode")) &&
                (transactionStatus == null || VNPAY_SUCCESS_CODE.equals(transactionStatus));
    }

    private BigDecimal parseVNPayAmount(String value) {
        try {
            return new BigDecimal(value).divide(BigDecimal.valueOf(100), 3, RoundingMode.HALF_UP);
        } catch (Exception ignored) {
            return null;
        }
    }

    private Integer parseOrderId(String value) {
        try {
            return Integer.parseInt(value);
        } catch (Exception ignored) {
            return null;
        }
    }

    private LocalDateTime parseVNPayDate(String value) {
        if (value == null || value.isBlank()) {
            return LocalDateTime.now();
        }

        try {
            return LocalDateTime.parse(value, VNPAY_DATE_FORMATTER);
        } catch (DateTimeParseException ignored) {
            return LocalDateTime.now();
        }
    }

    private boolean sameVndAmount(BigDecimal expected, BigDecimal actual) {
        if (expected == null || actual == null) {
            return false;
        }

        return expected.setScale(0, RoundingMode.HALF_UP)
                .compareTo(actual.setScale(0, RoundingMode.HALF_UP)) == 0;
    }

    private Map<String, Object> toPayloadJson(Map<String, String> fields) {
        Map<String, Object> payload = new HashMap<>();
        fields.forEach(payload::put);
        return payload;
    }

    private void assertSandboxVNPay() {
        String payUrl = vnPayConfig.getVnp_PayUrl();

        if (payUrl == null || !payUrl.contains("sandbox.vnpayment.vn")) {
            throw new IllegalStateException("Chỉ cho phép VNPay sandbox trong môi trường hiện tại");
        }
    }

    private record VNPayCallbackResult(String rspCode, PaymentStatusResponseDTO response) {
    }
}
