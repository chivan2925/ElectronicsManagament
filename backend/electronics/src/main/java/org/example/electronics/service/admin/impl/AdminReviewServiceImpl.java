package org.example.electronics.service.admin.impl;

import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminReviewResponseDTO;
import org.example.electronics.entity.ReviewEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.mapper.ReviewMapper;
import org.example.electronics.repository.ProductRepository;
import org.example.electronics.repository.ReviewRepository;
import org.example.electronics.service.admin.AdminReviewService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminReviewServiceImpl implements AdminReviewService {

    private final ReviewMapper reviewMapper;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    @Override
    public Page<AdminReviewResponseDTO> getAllReviewsByProductId(
            Integer productId,
            String keyword,
            DateFilterType dateType,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable
    ) {
        if(!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với id: " + productId);
        }

        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<ReviewEntity> reviewEntityPage = reviewRepository.findReviewsWithFilterByProductId(productId, finalKeyword, typeString, startDateTime, endDateTime, pageable);

        return reviewEntityPage.map(reviewMapper::toAdminResponseDTO);
    }
}
