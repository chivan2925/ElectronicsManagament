package org.example.electronics.service.system.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.repository.OrderRepository;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.example.electronics.service.system.SystemOrderService;
import org.example.electronics.service.system.SystemPaymentService;
import org.example.electronics.util.payment.MomoUtils;
import org.example.electronics.util.payment.VNPayUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemPaymentServiceImpl implements SystemPaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OrderRepository orderRepository;

    private final SystemOrderService systemOrderService;

    private final VNPayUtils vnPayUtils;

    private final MomoUtils momoUtils;

    @Transactional(rollbackFor = Exception.class)
    public String processVNPayIPN(Map<String, String> fields) {
        // 1. Kiểm tra Checksum (Mã băm) xem có đúng của VNPay gửi không (Hàm này lấy từ VNPayUtils sếp đã có)
        String vnp_SecureHash = fields.get("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        boolean isValidSignature = vnPayUtils.validateSignature(fields, vnp_SecureHash);
        if (!isValidSignature) {
            return "97"; // Mã lỗi VNPay: Checksum không hợp lệ
        }

        // 2. Lấy mã đơn hàng và số tiền
        String orderInfo = fields.get("vnp_TxnRef"); // OrderId sếp truyền vào lúc tạo link
        long vnpAmount = Long.parseLong(fields.get("vnp_Amount")) / 100;
        String responseCode = fields.get("vnp_ResponseCode");

        // 3. Tìm Đơn hàng và Giao dịch trong DB
        OrderEntity order = orderRepository.findById(Integer.parseInt(orderInfo)).orElse(null);
        if (order == null) return "01"; // Lỗi: Order không tồn tại

        PaymentTransactionEntity transaction = paymentTransactionRepository.findByOrderId(order.getId()).orElse(null);
        if (transaction == null) return "01";

        // 4. Kiểm tra xem đơn đã được xác nhận trước đó chưa (Chống Duplicate)
        if (transaction.getStatus() == PaymentTransactionStatus.SUCCESS) {
            return "02"; // Lỗi: Đơn đã được cập nhật trạng thái rồi
        }

        // 5. Kiểm tra số tiền có khớp không (Chống hacker sửa giá)
        if (transaction.getAmount().longValue() != vnpAmount) {
            return "04"; // Lỗi: Số tiền không khớp
        }

        // 6. Xử lý Logic Nghiệp Vụ (Áp dụng State Machine của sếp)
        if ("00".equals(responseCode)) {
            // Khách trả tiền THÀNH CÔNG
            transaction.setStatus(PaymentTransactionStatus.SUCCESS);

            systemOrderService.confirmSuccessfulPayment(order.getId());
            log.info("VNPay IPN: Xử lý thành công đơn hàng {}", orderInfo);
        } else {
            // Khách HỦY hoặc LỖI
            transaction.setStatus(PaymentTransactionStatus.FAILED);
            order.setPaymentStatus(PaymentStatus.FAILED);
            log.info("VNPay IPN: Thanh toán thất bại cho đơn hàng {}. ResponseCode: {}", orderInfo, responseCode);
        }

        paymentTransactionRepository.save(transaction);
        orderRepository.save(order);

        return "00"; // Mã "00" báo cho VNPay biết server sếp đã ghi nhận thành công!
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void processMomoIPN(Map<String, Object> requestBody) {
        // 1. Kiểm tra chữ ký (Signature) xem có đúng chuẩn Momo gửi không
        boolean isValidSignature = momoUtils.validateSignature(requestBody);
        if (!isValidSignature) {
            log.warn("Momo IPN: Sai chữ ký bảo mật! Dữ liệu có thể bị giả mạo.");
            return; // Sai chữ ký thì âm thầm kết thúc, không làm gì cả
        }

        // 2. Bóc tách dữ liệu từ cục JSON
        // Lưu ý: Momo gửi số về là Integer/Long nên phải ép kiểu cẩn thận
        String orderIdStr = String.valueOf(requestBody.get("orderId"));
        int resultCode = (int) requestBody.get("resultCode");
        long amount = Long.parseLong(String.valueOf(requestBody.get("amount")));

        // 3. Tìm Đơn hàng và Giao dịch trong DB
        // Giả sử sếp dùng orderIdStr (chuỗi sếp tạo ra lúc gửi Momo) để map với ID đơn hàng
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

        // 4. Chống Duplicate (Nếu đã cập nhật rồi thì thôi)
        if (transaction.getStatus() == PaymentTransactionStatus.SUCCESS) {
            log.info("Momo IPN: Giao dịch này đã được xử lý thành công từ trước.");
            return;
        }

        // 5. Kiểm tra tính toàn vẹn của số tiền
        if (transaction.getAmount().longValue() != amount) {
            log.error("Momo IPN: Số tiền không khớp! DB: {}, Momo gửi: {}", transaction.getAmount(), amount);
            return;
        }

        // 6. XỬ LÝ STATE MACHINE
        if (resultCode == 0) {
            // Khách trả tiền THÀNH CÔNG
            transaction.setStatus(PaymentTransactionStatus.SUCCESS);

            // Nhảy bước cho Order
            systemOrderService.confirmSuccessfulPayment(order.getId());
            log.info("Momo IPN: Xử lý thành công đơn hàng {}", orderIdStr);
        } else {
            // Khách HỦY hoặc LỖI (resultCode != 0)
            transaction.setStatus(PaymentTransactionStatus.FAILED);
            order.setPaymentStatus(PaymentStatus.FAILED);
            log.info("Momo IPN: Thanh toán thất bại cho đơn hàng {}. ResultCode: {}", orderIdStr, resultCode);
        }

        // 7. Lưu xuống DB
        paymentTransactionRepository.save(transaction);
        orderRepository.save(order);
    }
}
