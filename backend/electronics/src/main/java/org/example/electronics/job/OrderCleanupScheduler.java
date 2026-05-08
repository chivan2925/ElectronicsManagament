package org.example.electronics.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.repository.OrderRepository;
import org.example.electronics.service.admin.AdminOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCleanupScheduler {

    private final OrderRepository orderRepository;
    private final AdminOrderService adminOrderService;

    @Scheduled(fixedDelay = 300000)
    public void scanAndCancelExpiredOrders() {
        LocalDateTime thresholdTime = LocalDateTime.now().minusMinutes(15);

        int page = 0;
        int size = 50;

        Page<OrderEntity> expiredOrdersPage;

        do {
            Pageable pageable = PageRequest.of(page, size);
            expiredOrdersPage = orderRepository.findExpiredPendingOrders(thresholdTime, pageable);

            if (expiredOrdersPage.isEmpty()) {
                log.info("✅ Không có đơn hàng nào quá hạn.");
                break;
            }

            log.info("Phát hiện {} đơn hàng quá hạn ở trang {}. Tiến hành hủy...", expiredOrdersPage.getNumberOfElements(), page);

            for (OrderEntity order : expiredOrdersPage.getContent()) {
                try {
                    adminOrderService.cancelSingleExpiredOrder(order.getId());
                } catch (Exception e) {
                    log.error("Lỗi khi tự động hủy đơn hàng ID {}: {}", order.getId(), e.getMessage());
                }
            }

            page++;
        } while (expiredOrdersPage.hasNext());
    }
}
