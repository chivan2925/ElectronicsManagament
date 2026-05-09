package org.example.electronics.service.admin;

import org.example.electronics.dto.response.admin.AdminReviewResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminReviewService {

    Page<AdminReviewResponseDTO> getAllReviewsByProductId(Integer productId, String keyword, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
}
