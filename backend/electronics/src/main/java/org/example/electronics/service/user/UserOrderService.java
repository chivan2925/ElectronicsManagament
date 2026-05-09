package org.example.electronics.service.user;

import org.example.electronics.dto.request.user.order.UserCreateOrderRequestDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderDetailResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserOrderService {

    AdminOrderDetailResponseDTO createOrder(UserCreateOrderRequestDTO requestDTO);

    AdminOrderDetailResponseDTO getOrderByIdForUser(Integer userId, Integer orderId);

    Page<AdminOrderResponseDTO> getOrdersByUserId(Integer userId, Pageable pageable);
}
