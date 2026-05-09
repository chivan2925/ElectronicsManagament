package org.example.electronics.service.user.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.user.order.UserCreateOrderItemRequestDTO;
import org.example.electronics.dto.request.user.order.UserCreateOrderRequestDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderDetailResponseDTO;
import org.example.electronics.dto.response.admin.order.AdminOrderResponseDTO;
import org.example.electronics.entity.CouponEntity;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponType;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.ProductStatus;
import org.example.electronics.entity.enums.ShippingStatus;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.entity.order.OrderDetailEntity;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.mapper.OrderMapper;
import org.example.electronics.repository.CouponRepository;
import org.example.electronics.repository.OrderRepository;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.repository.VariantRepository;
import org.example.electronics.service.admin.AdminWarehouseTransactionService;
import org.example.electronics.service.user.UserOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserOrderServiceImpl implements UserOrderService {

    private final AdminWarehouseTransactionService adminWarehouseTransactionService;
    private final CouponRepository couponRepository;
    private final OrderMapper orderMapper;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VariantRepository variantRepository;

    @Transactional
    @Override
    public AdminOrderDetailResponseDTO createOrder(UserCreateOrderRequestDTO requestDTO) {
        UserEntity user = userRepository.findById(requestDTO.userId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + requestDTO.userId()));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalStateException("Tài khoản không đủ điều kiện đặt hàng");
        }

        List<OrderDetailEntity> orderDetails = buildOrderDetails(requestDTO.items());
        BigDecimal subtotal = orderDetails.stream()
                .map((detail) -> detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shippingFee = requestDTO.shippingFee() == null ? BigDecimal.ZERO : requestDTO.shippingFee();
        CouponEntity coupon = resolveCoupon(requestDTO.couponCode(), subtotal, orderDetails);
        BigDecimal discount = calculateDiscount(coupon, subtotal, orderDetails);
        BigDecimal total = subtotal.add(shippingFee).subtract(discount).max(BigDecimal.ZERO);

        OrderEntity order = OrderEntity.builder()
                .code(generateOrderCode())
                .coupon(coupon)
                .discount(discount)
                .note(requestDTO.note())
                .paymentMethodType(requestDTO.paymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .shippingDistrict(requestDTO.shippingDistrict())
                .shippingFee(shippingFee)
                .shippingLine(requestDTO.shippingLine())
                .shippingName(requestDTO.shippingName())
                .shippingPhone(normalizePhone(requestDTO.shippingPhone()))
                .shippingProvider(requestDTO.shippingProvider())
                .shippingProvince(requestDTO.shippingProvince())
                .shippingStatus(ShippingStatus.PENDING)
                .shippingWard(requestDTO.shippingWard())
                .status(OrderStatus.PENDING)
                .subtotal(subtotal)
                .total(total)
                .user(user)
                .build();

        orderDetails.forEach(order::addOrderDetail);

        OrderEntity savedOrder = orderRepository.save(order);
        adminWarehouseTransactionService.autoCreateReservedWarehouseTransactionForOrder(savedOrder, null);

        return orderMapper.toAdminDetailResponseDTO(savedOrder);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminOrderDetailResponseDTO getOrderByIdForUser(Integer userId, Integer orderId) {
        assertUserExists(userId);

        OrderEntity order = orderRepository.findOrderByIdAndUserIdWithDetails(orderId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với id: " + orderId));

        return orderMapper.toAdminDetailResponseDTO(order);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminOrderResponseDTO> getOrdersByUserId(Integer userId, Pageable pageable) {
        assertUserExists(userId);

        return orderRepository.findOrdersByUserId(userId, pageable)
                .map(orderMapper::toAdminResponseDTO);
    }

    private List<OrderDetailEntity> buildOrderDetails(List<UserCreateOrderItemRequestDTO> items) {
        List<OrderDetailEntity> orderDetails = new ArrayList<>();

        for (UserCreateOrderItemRequestDTO item : items) {
            VariantEntity variant = variantRepository.findVariantWithBasicDetailsById(item.variantId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy biến thể sản phẩm với id: " + item.variantId()));

            if (variant.getStatus() != ProductStatus.ACTIVE || variant.getTotalStock() < item.quantity()) {
                throw new IllegalStateException("Sản phẩm " + variant.getName() + " không đủ tồn kho");
            }

            orderDetails.add(OrderDetailEntity.builder()
                    .price(variant.getPrice())
                    .quantity(item.quantity())
                    .variant(variant)
                    .build());
        }

        return orderDetails;
    }

    private CouponEntity resolveCoupon(String couponCode, BigDecimal subtotal, List<OrderDetailEntity> orderDetails) {
        if (!StringUtils.hasText(couponCode)) {
            return null;
        }

        CouponEntity coupon = couponRepository.findByCodeIgnoreCase(couponCode.trim())
                .orElseThrow(() -> new IllegalArgumentException("Mã giảm giá không hợp lệ"));

        if (coupon.getStatus() != CouponStatus.ACTIVE || !coupon.isValidTime()) {
            throw new IllegalArgumentException("Mã giảm giá đã hết hạn hoặc chưa khả dụng");
        }

        if (subtotal.compareTo(coupon.getMinOrder()) < 0) {
            throw new IllegalArgumentException("Đơn hàng chưa đạt giá trị tối thiểu của mã giảm giá");
        }

        if (getCouponEligibleSubtotal(coupon, orderDetails).compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Mã giảm giá không áp dụng cho sản phẩm trong giỏ hàng");
        }

        return coupon;
    }

    private BigDecimal calculateDiscount(CouponEntity coupon, BigDecimal subtotal, List<OrderDetailEntity> orderDetails) {
        if (coupon == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal eligibleSubtotal = getCouponEligibleSubtotal(coupon, orderDetails);
        BigDecimal discount = coupon.getType() == CouponType.PERCENT
                ? eligibleSubtotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100), 3, RoundingMode.HALF_UP)
                : coupon.getValue().min(eligibleSubtotal);

        if (coupon.getMaxDiscount() != null && coupon.getMaxDiscount().compareTo(BigDecimal.ZERO) > 0) {
            discount = discount.min(coupon.getMaxDiscount());
        }

        return discount.min(subtotal).max(BigDecimal.ZERO);
    }

    private BigDecimal getCouponEligibleSubtotal(CouponEntity coupon, List<OrderDetailEntity> orderDetails) {
        return orderDetails.stream()
                .filter((detail) -> isCouponEligibleForVariant(coupon, detail.getVariant()))
                .map((detail) -> detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private boolean isCouponEligibleForVariant(CouponEntity coupon, VariantEntity variant) {
        if (coupon.getCategory() != null &&
                !coupon.getCategory().getId().equals(variant.getProduct().getCategory().getId())) {
            return false;
        }

        return coupon.getBrand() == null ||
                coupon.getBrand().getId().equals(variant.getProduct().getBrand().getId());
    }

    private String generateOrderCode() {
        return "ORD" + System.currentTimeMillis();
    }

    private String normalizePhone(String phone) {
        String digits = phone == null ? "" : phone.replaceAll("[^0-9]", "");

        if (digits.startsWith("84") && digits.length() == 11) {
            return "0" + digits.substring(2);
        }

        return digits.length() > 10 ? digits.substring(digits.length() - 10) : digits;
    }

    private void assertUserExists(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));

        if (user.getStatus() == UserStatus.DELETED) {
            throw new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId);
        }
    }
}
