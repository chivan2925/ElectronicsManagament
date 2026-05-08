package org.example.electronics.dto.request.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.electronics.dto.request.admin.media.AdminNestedMediaRequestDTO;
import org.example.electronics.entity.enums.ProductStatus;

import java.util.List;
import java.util.Map;

public record AdminProductRequestDTO (
        @NotBlank(message = "Tên sản phẩm không được để trống")
        String name,

        @NotBlank(message = "Slug sản phẩm không được để trống")
        @Schema(description = "Đường dẫn thân thiện cho SEO", example = "laptop-gaming")
        String slug,

        @NotNull(message = "ID Danh mục sản phẩm không được để trống")
        Integer categoryId,

        @NotNull(message = "ID Thương hiệu sản phẩm không được để trống")
        Integer brandId,

        String description,

        @Schema(description = "Thông số chung của sản phẩm")
        Map<String, Object> specsJson,

        @NotNull(message = "Thời hạn bảo hành sản phẩm không được để trống")
        Integer warrantyMonths,

        List<@Valid AdminNestedMediaRequestDTO> media,

        @NotNull(message = "Trạng thái sản phẩm không được để trống")
        ProductStatus status
) {
}
