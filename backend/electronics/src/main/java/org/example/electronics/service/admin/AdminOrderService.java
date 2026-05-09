package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.order.AdminUpdateOrderRequestDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderDetailResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderResponseDTO;
import org.example.electronics.entity.enums.*;
import org.example.electronics.entity.order.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminOrderService {

    AdminOrderResponseDTO updateOrder(Integer orderId, AdminUpdateOrderRequestDTO adminUpdateOrderRequestDTO, Integer staffId);

    Page<AdminOrderResponseDTO> getAllOrders(String keyword, OrderStatus status, PaymentMethodType type,
                                             PaymentStatus paymentStatus, ShippingProvider provider, ShippingStatus shippingStatus,
                                             DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    AdminOrderDetailResponseDTO getOrderById(Integer orderId);

    void cancelSingleExpiredOrder(Integer orderId);
}
