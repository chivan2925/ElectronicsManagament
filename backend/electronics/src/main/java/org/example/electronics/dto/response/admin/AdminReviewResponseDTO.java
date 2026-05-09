package org.example.electronics.dto.response.admin;

import java.time.LocalDateTime;
import java.util.List;

public record AdminReviewResponseDTO (
        Integer id,
        Integer productId,
        Integer userId,
        Integer orderId,
        Integer ratingStar,
        String content,
        List<String> photosJson,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
