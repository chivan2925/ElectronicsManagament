package org.example.electronics.dto.response.admin;

import java.time.LocalDateTime;

public record AdminAddressResponseDTO(
        Integer id,

        Integer userId,

        String label,

        String line,

        String ward,

        String district,

        String province,

        String note,

        Boolean defaultAddress,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
