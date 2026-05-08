package org.example.electronics.service.admin;

import org.example.electronics.dto.response.admin.AdminPaymentTransactionResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminPaymentTransactionService {

    Page<AdminPaymentTransactionResponseDTO> getAllPaymentTransactions(String keyword, PaymentTransactionType type, PaymentTransactionStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    AdminPaymentTransactionResponseDTO getPaymentTransactionById(Integer id);

    void processRefund(Integer returnRequestId, Integer staffId);
}
