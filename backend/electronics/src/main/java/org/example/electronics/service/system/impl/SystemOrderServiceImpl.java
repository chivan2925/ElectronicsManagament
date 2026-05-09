package org.example.electronics.service.system.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.order.OrderEntity;
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
            log.warn("Đơn hàng {} không ở trạng thái PENDING. Bỏ qua trigger tự động.", orderId);
            return;
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PROCESSING);

        adminWarehouseTransactionService.convertToExportFromReserved(order, null);

        orderRepository.save(order);

        log.info("Đã ghi nhận thanh toán thành công và tự động xuất kho cho đơn hàng ID: {}", orderId);
    }
}
