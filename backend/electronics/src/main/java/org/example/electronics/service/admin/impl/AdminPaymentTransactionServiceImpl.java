package org.example.electronics.service.admin.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.example.electronics.dto.response.admin.AdminPaymentTransactionResponseDTO;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.example.electronics.mapper.PaymentTransactionMapper;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.example.electronics.repository.ReturnRequestRepository;
import org.example.electronics.service.admin.AdminPaymentTransactionService;
import org.example.electronics.service.admin.payment.RefundStrategy;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminPaymentTransactionServiceImpl implements AdminPaymentTransactionService {

    private final PaymentTransactionMapper paymentTransactionMapper;
    private final PaymentTransactionRepository paymentTransactionRepository;

    private final ReturnRequestRepository returnRequestRepository;

    private final List<RefundStrategy> refundStrategies;

    @Transactional(readOnly = true)
    @Override
    public Page<AdminPaymentTransactionResponseDTO> getAllPaymentTransactions(String keyword, PaymentTransactionType type, PaymentTransactionStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<PaymentTransactionEntity> entityPage = paymentTransactionRepository.findPaymentsWithFilter(finalKeyword, type, status, typeString, startDateTime, endDateTime, pageable);

        return entityPage.map(paymentTransactionMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminPaymentTransactionResponseDTO getPaymentTransactionById(Integer id) {
        PaymentTransactionEntity existingPaymentTransactionEntity = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy giao dịch thanh toán với id: " + id
                ));

        return paymentTransactionMapper.toAdminResponseDTO(existingPaymentTransactionEntity);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void processRefund(Integer returnRequestId, Integer staffId) {
        ReturnRequestEntity returnRequest = returnRequestRepository.findById(returnRequestId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy yêu cầu trả hàng với id: " + returnRequestId
                ));

        PaymentTransactionEntity originalPaymentTransaction = paymentTransactionRepository.findByOrderIdAndTypeAndStatus(
                returnRequest.getOrder().getId(),
                PaymentTransactionType.PAYMENT,
                PaymentTransactionStatus.SUCCESS
        ).orElseThrow(() -> new RuntimeException(
                "Đơn hàng này chưa thanh toán hoặc thanh toán lỗi, không thể hoàn tiền"
        ));

        PaymentProvider currentProvider = originalPaymentTransaction.getProvider();

        RefundStrategy refundStrategy = refundStrategies.stream()
                .filter(s -> s.getSupportedProvider() == currentProvider)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Hệ thống chưa hỗ trợ hoàn tiền cho: " + currentProvider
                ));

        refundStrategy.process(originalPaymentTransaction, returnRequest, staffId);
    }
}
