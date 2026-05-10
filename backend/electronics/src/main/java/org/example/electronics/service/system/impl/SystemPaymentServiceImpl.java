package org.example.electronics.service.system.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.config.payment.MomoConfig;
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
import org.example.electronics.service.system.payment.PaymentGatewayService;
import org.example.electronics.util.payment.MomoUtils;
import org.example.electronics.util.payment.VNPayUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
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
    private final List<PaymentGatewayService> paymentGatewayServices;
    private final MomoConfig momoConfig;
    private final VNPayConfig vnPayConfig;
    private final VNPayUtils vnPayUtils;
    private final MomoUtils momoUtils;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentLinkResponseDTO createPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request) {
        OrderEntity order = orderRepository.findOrderByIdWithDetails(requestDTO.orderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với id: " + requestDTO.orderId()));

        if (order.getStatus() != OrderStatus.PENDING || order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Chỉ đơn hàng đang chờ thanh toán mới có thể tạo link thanh toán");
        }

        if (order.getPaymentMethodType() != PaymentMethodType.DIGITAL) {
            throw new IllegalStateException("Đơn hàng không được cấu hình phương thức thanh toán online");
        }

        PaymentGatewayService paymentGateway = resolvePaymentGateway(requestDTO.provider());
        PaymentTransactionEntity transaction = paymentTransactionRepository
                .findTopByOrderIdAndTypeAndProviderOrderByCreatedAtDesc(
                        order.getId(),
                        PaymentTransactionType.PAYMENT,
                        requestDTO.provider()
                )
                .filter((existingTransaction) -> existingTransaction.getStatus() == PaymentTransactionStatus.PENDING)
                .orElseGet(() -> PaymentTransactionEntity.builder()
                        .order(order)
                        .type(PaymentTransactionType.PAYMENT)
                        .provider(requestDTO.provider())
                        .status(PaymentTransactionStatus.PENDING)
                        .build());

        transaction.setAmount(order.getTotal());
        transaction.setNote(requestDTO.provider() + " sandbox payment link created for order " + order.getCode());
        transaction = paymentTransactionRepository.save(transaction);

        PaymentLinkResponseDTO response = paymentGateway.createPaymentLink(order, transaction, request);
        paymentTransactionRepository.save(transaction);

        return response;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentLinkResponseDTO createVNPayPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request) {
        return createPaymentLink(requestDTO, request);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentLinkResponseDTO createMomoPaymentLink(CreatePaymentLinkRequestDTO requestDTO, HttpServletRequest request) {
        return createPaymentLink(requestDTO, request);
    }

    @Transactional(readOnly = true)
    @Override
    public PaymentStatusResponseDTO getOrderPaymentStatus(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với id: " + orderId));

        PaymentTransactionEntity transaction = findLatestPaymentTransaction(order.getId());

        return buildPaymentResponse(order, transaction, null, "Trạng thái thanh toán hiện tại", true, null);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentStatusResponseDTO processVNPayReturn(Map<String, String> fields) {
        return handleVNPayCallback(fields).response();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PaymentStatusResponseDTO processMomoReturn(Map<String, Object> fields) {
        return handleMomoCallback(fields).response();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public String processVNPayIPN(Map<String, String> fields) {
        return handleVNPayCallback(fields).rspCode();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void processMomoIPN(Map<String, Object> requestBody) {
        handleMomoCallback(requestBody);
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

    private MomoCallbackResult handleMomoCallback(Map<String, Object> rawFields) {
        Map<String, Object> fields = rawFields == null ? Map.of() : rawFields;
        String resultCode = valueOf(fields.get("resultCode"));
        Integer orderId = parseMomoOrderId(valueOf(fields.get("orderId")));

        if (!momoUtils.validateSignature(fields)) {
            return new MomoCallbackResult(
                    buildPaymentResponse(null, null, resultCode, "Chữ ký MoMo không hợp lệ", false, orderId, PaymentProvider.MOMO)
            );
        }

        if (!Objects.equals(valueOf(fields.get("partnerCode")), momoConfig.getPartnerCode())) {
            return new MomoCallbackResult(
                    buildPaymentResponse(null, null, resultCode, "Mã merchant MoMo không hợp lệ", false, orderId, PaymentProvider.MOMO)
            );
        }

        if (orderId == null) {
            return new MomoCallbackResult(
                    buildPaymentResponse(null, null, resultCode, "Mã đơn hàng MoMo không hợp lệ", false, null, PaymentProvider.MOMO)
            );
        }

        OrderEntity order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return new MomoCallbackResult(
                    buildPaymentResponse(null, null, resultCode, "Không tìm thấy đơn hàng", false, orderId, PaymentProvider.MOMO)
            );
        }

        PaymentTransactionEntity transaction = findProviderPaymentTransaction(order.getId(), PaymentProvider.MOMO);
        if (transaction == null) {
            return new MomoCallbackResult(
                    buildPaymentResponse(order, null, resultCode, "Không tìm thấy giao dịch MoMo", false, orderId, PaymentProvider.MOMO)
            );
        }

        BigDecimal callbackAmount = parseAmount(valueOf(fields.get("amount")));
        if (callbackAmount == null || !sameVndAmount(transaction.getAmount(), callbackAmount)) {
            return new MomoCallbackResult(
                    buildPaymentResponse(order, transaction, resultCode, "Số tiền thanh toán MoMo không khớp", false, orderId, PaymentProvider.MOMO)
            );
        }

        if (transaction.getStatus() == PaymentTransactionStatus.SUCCESS) {
            return new MomoCallbackResult(
                    buildPaymentResponse(order, transaction, resultCode, "Giao dịch đã được ghi nhận trước đó", true, orderId, PaymentProvider.MOMO)
            );
        }

        if (transaction.getStatus() == PaymentTransactionStatus.FAILED ||
                transaction.getStatus() == PaymentTransactionStatus.CANCELLED) {
            return new MomoCallbackResult(
                    buildPaymentResponse(order, transaction, resultCode, "Giao dịch đã ở trạng thái cuối", true, orderId, PaymentProvider.MOMO)
            );
        }

        transaction.setPayloadJson(toPayloadJson(fields));
        transaction.setPaymentTime(parseMomoResponseTime(fields.get("responseTime")));

        if ("0".equals(resultCode)) {
            transaction.setStatus(PaymentTransactionStatus.SUCCESS);
            transaction.setProviderPaymentId(valueOf(fields.get("transId")));
            systemOrderService.confirmSuccessfulPayment(order.getId());
            log.info("MoMo callback: Xử lý thành công đơn hàng {}", order.getId());
        } else if (isCancelledMomoPayment(resultCode)) {
            transaction.setStatus(PaymentTransactionStatus.CANCELLED);
            systemOrderService.closeUnpaidOrder(order.getId(), PaymentStatus.CANCELLED, "Khách hàng đã hủy thanh toán MoMo.");
            log.info("MoMo callback: Khách hàng hủy thanh toán đơn hàng {}", order.getId());
        } else {
            transaction.setStatus(PaymentTransactionStatus.FAILED);
            systemOrderService.closeUnpaidOrder(order.getId(), PaymentStatus.FAILED, "Thanh toán MoMo thất bại. Mã phản hồi: " + resultCode);
            log.info("MoMo callback: Thanh toán thất bại cho đơn hàng {}. ResultCode: {}", order.getId(), resultCode);
        }

        paymentTransactionRepository.save(transaction);

        return new MomoCallbackResult(
                buildPaymentResponse(order, transaction, resultCode, "Đã xác minh phản hồi MoMo", true, orderId, PaymentProvider.MOMO)
        );
    }

    private PaymentGatewayService resolvePaymentGateway(PaymentProvider provider) {
        if (provider == null || provider == PaymentProvider.COD) {
            throw new IllegalArgumentException("Nhà cung cấp thanh toán online không hợp lệ");
        }

        return paymentGatewayServices.stream()
                .filter((gateway) -> gateway.getProvider() == provider)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Chưa hỗ trợ tạo thanh toán cho: " + provider));
    }

    private PaymentTransactionEntity findVNPayPaymentTransaction(Integer orderId) {
        return findProviderPaymentTransaction(orderId, PaymentProvider.VNPAY);
    }

    private PaymentTransactionEntity findProviderPaymentTransaction(Integer orderId, PaymentProvider provider) {
        return paymentTransactionRepository
                .findTopByOrderIdAndTypeAndProviderOrderByCreatedAtDesc(
                        orderId,
                        PaymentTransactionType.PAYMENT,
                        provider
                )
                .orElse(null);
    }

    private PaymentTransactionEntity findLatestPaymentTransaction(Integer orderId) {
        return paymentTransactionRepository
                .findTopByOrderIdAndTypeOrderByCreatedAtDesc(orderId, PaymentTransactionType.PAYMENT)
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
        return buildPaymentResponse(order, transaction, responseCode, message, verified, fallbackOrderId, PaymentProvider.VNPAY);
    }

    private PaymentStatusResponseDTO buildPaymentResponse(
            OrderEntity order,
            PaymentTransactionEntity transaction,
            String responseCode,
            String message,
            boolean verified,
            Integer fallbackOrderId,
            PaymentProvider fallbackProvider
    ) {
        Integer orderId = order != null ? order.getId() : fallbackOrderId;
        PaymentProvider provider = transaction != null ? transaction.getProvider() : fallbackProvider;
        String status = resolveClientPaymentStatus(order, transaction, verified);
        String redirectUrl = buildFrontendRedirectUrl(provider, status, orderId, transaction, responseCode, verified, message);

        return new PaymentStatusResponseDTO(
                orderId,
                order != null ? order.getCode() : null,
                transaction != null ? transaction.getId() : null,
                provider,
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
            PaymentProvider provider,
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
                .queryParam("provider", provider.name())
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

    private Map<String, Object> toPayloadJson(Map<?, ?> fields) {
        Map<String, Object> payload = new HashMap<>();
        fields.forEach((key, value) -> {
            if (key != null) {
                payload.put(String.valueOf(key), value);
            }
        });
        return payload;
    }

    private BigDecimal parseAmount(String value) {
        try {
            return new BigDecimal(value);
        } catch (Exception ignored) {
            return null;
        }
    }

    private Integer parseMomoOrderId(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String trimmedValue = value.trim();
        int orderMarker = trimmedValue.indexOf("ORDER-");
        int transactionMarker = trimmedValue.indexOf("-TX-", orderMarker + 6);

        if (orderMarker >= 0 && transactionMarker > orderMarker) {
            return parseOrderId(trimmedValue.substring(orderMarker + 6, transactionMarker));
        }

        return parseOrderId(trimmedValue);
    }

    private LocalDateTime parseMomoResponseTime(Object value) {
        String responseTime = valueOf(value);

        if (responseTime.isBlank()) {
            return LocalDateTime.now();
        }

        try {
            return LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(Long.parseLong(responseTime)),
                    ZoneId.systemDefault()
            );
        } catch (Exception ignored) {
            return LocalDateTime.now();
        }
    }

    private boolean isCancelledMomoPayment(String resultCode) {
        return "1006".equals(resultCode);
    }

    private String valueOf(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private record VNPayCallbackResult(String rspCode, PaymentStatusResponseDTO response) {
    }

    private record MomoCallbackResult(PaymentStatusResponseDTO response) {
    }
}
