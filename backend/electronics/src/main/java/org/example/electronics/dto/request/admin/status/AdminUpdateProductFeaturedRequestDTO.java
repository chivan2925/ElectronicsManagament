package org.example.electronics.dto.request.admin.status;

import jakarta.validation.constraints.NotNull;

public record AdminUpdateProductFeaturedRequestDTO(
        @NotNull(message = "Featured flag must not be null")
        Boolean featured
) {
}
