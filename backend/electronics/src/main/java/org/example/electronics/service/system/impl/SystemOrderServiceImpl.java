package org.example.electronics.service.system.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.ShippingStatus;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.monitoring.MonitoringLogger;
import org.example.electronics.repository.OrderRepository;
import org.example.electronics.service.admin.AdminWarehouseTransactionService;
import org.example.electronics.service.system.SystemOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemOrderServiceImpl implements SystemOrderService {

    private final OrderRepository orderRepository;

    private final AdminWarehouseTransactionService adminWarehouseTransactionService;

    @Transactional(rollbackFor = Exception.class)
    public void confirmSuccessfulPayment(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));

        OrderStatus oldStatus = order.getStatus();

        if (oldStatus != OrderStatus.PENDING) {
            MonitoringLogger.warn(log, "order.payment_confirm.skipped", MonitoringLogger.fields(
                    "orderId", orderId,
                    "status", oldStatus
            ));
            return;
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PROCESSING);

        adminWarehouseTransactionService.convertToExportFromReserved(order, null);

        orderRepository.save(order);

        MonitoringLogger.info(log, "order.payment_confirm.completed", MonitoringLogger.fields(
                "orderCode", order.getCode(),
                "orderId", orderId,
                "paymentStatus", order.getPaymentStatus(),
                "status", order.getStatus()
        ));
    }

    @Transactional(rollbackFor = Exception.class)
    public void closeUnpaidOrder(Integer orderId, PaymentStatus paymentStatus, String note) {
        if (paymentStatus != PaymentStatus.FAILED && paymentStatus != PaymentStatus.CANCELLED) {
            throw new IllegalArgumentException("Trạng thái thanh toán không hợp lệ cho đơn chưa thanh toán: " + paymentStatus);
        }

        OrderEntity order = orderRepository.findOrderByIdWithDetails(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));

        if (order.getPaymentStatus() == PaymentStatus.PAID || order.getStatus() != OrderStatus.PENDING) {
            MonitoringLogger.warn(log, "order.unpaid_close.skipped", MonitoringLogger.fields(
                    "orderId", orderId,
                    "paymentStatus", order.getPaymentStatus(),
                    "status", order.getStatus()
            ));
            return;
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(paymentStatus);
        order.setShippingStatus(ShippingStatus.CANCELLED);
        order.setNote(note);

        adminWarehouseTransactionService.autoCreateUnreservedTransactionForOrder(order, null);
        orderRepository.save(order);

        MonitoringLogger.info(log, "order.unpaid_close.completed", MonitoringLogger.fields(
                "orderCode", order.getCode(),
                "orderId", orderId,
                "paymentStatus", order.getPaymentStatus(),
                "status", order.getStatus()
        ));
    }
}
