package org.example.electronics.dto.request.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.example.electronics.dto.request.admin.media.AdminNestedMediaRequestDTO;
import org.example.electronics.entity.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record AdminVariantRequestDTO(
        @NotNull(message = "ID Sản phẩm không được để trống")
        Integer productId,

        List<@Valid AdminNestedMediaRequestDTO> media,

        @NotBlank(message = "Tên biến thể sản phẩm không được để trống")
        String name,

        @NotBlank(message = "Slug biến thể sản phẩm không được để trống")
        @Schema(description = "Đường dẫn thân thiện cho SEO", example = "laptop-gaming")
        String slug,

        @NotBlank(message = "Màu biến thể sản phẩm không được để trống")
        String color,

        @Schema(description = "Thông số của biến thể sản phẩm")
        Map<String, Object> specsJson,

        @NotNull(message = "Giá biến thể sản phẩm không được để trống")
        @PositiveOrZero(message = "Giá biến thể sản phẩm không được nhỏ hơn 0")
        BigDecimal price,

        @NotNull(message = "Tổng số lượng tồn kho biến thể sản phẩm không được để trống")
        @PositiveOrZero(message = "Tổng số lượng tồn kho biến thể sản phẩm không được nhỏ hơn 0")
        Integer totalStock,

        @NotNull(message = "Trạng thái biến thể sản phẩm không được để trống")
        ProductStatus status
) {
}
