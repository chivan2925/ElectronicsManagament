package org.example.electronics.dto.response.system;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ErrorResponseDTO(

        LocalDateTime timestamp,
        int statusCode,
        String error,
        String message,
        Object details
) {
}
