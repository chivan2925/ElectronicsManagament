package org.example.electronics.dto.request.user.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.PaymentMethodType;
import org.example.electronics.entity.enums.ShippingProvider;

import java.math.BigDecimal;
import java.util.List;

public record UserCreateOrderRequestDTO(

        @NotNull(message = "Người dùng không được để trống")
        Integer userId,

        @NotBlank(message = "Tên người nhận không được để trống")
        @Size(max = 100, message = "Tên người nhận không được vượt quá 100 ký tự")
        String shippingName,

        @NotBlank(message = "Số điện thoại nhận hàng không được để trống")
        @Size(max = 13, message = "Số điện thoại nhận hàng không được vượt quá 13 ký tự")
        String shippingPhone,

        @NotBlank(message = "Địa chỉ chi tiết không được để trống")
        String shippingLine,

        @NotBlank(message = "Phường/xã không được để trống")
        @Size(max = 50, message = "Phường/xã không được vượt quá 50 ký tự")
        String shippingWard,

        @NotBlank(message = "Quận/huyện không được để trống")
        @Size(max = 50, message = "Quận/huyện không được vượt quá 50 ký tự")
        String shippingDistrict,

        @NotBlank(message = "Tỉnh/thành phố không được để trống")
        @Size(max = 50, message = "Tỉnh/thành phố không được vượt quá 50 ký tự")
        String shippingProvince,

        @NotNull(message = "Phương thức thanh toán không được để trống")
        PaymentMethodType paymentMethod,

        @NotNull(message = "Đơn vị vận chuyển không được để trống")
        ShippingProvider shippingProvider,

        @NotNull(message = "Phí vận chuyển không được để trống")
        @PositiveOrZero(message = "Phí vận chuyển không được âm")
        BigDecimal shippingFee,

        String couponCode,

        String note,

        @Valid
        @NotEmpty(message = "Đơn hàng cần ít nhất một sản phẩm")
        List<UserCreateOrderItemRequestDTO> items
) {
}
