package org.example.electronics.dto.response.admin.variant;

import org.example.electronics.dto.response.admin.AdminMediaResponseDTO;
import org.example.electronics.entity.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record AdminDetailVariantResponseDTO(
        Integer id,

        Integer productId,

        String productName,

        List<AdminMediaResponseDTO> media,

        String name,

        String slug,

        String color,

        Map<String, Object> specsJson,

        BigDecimal price,

        BigDecimal totalWarehouseValue,

        List<AdminVariantWarehouseStockResponseDTO> warehouseStocks,

        Integer totalStock,

        String primaryImageUrl,

        ProductStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
