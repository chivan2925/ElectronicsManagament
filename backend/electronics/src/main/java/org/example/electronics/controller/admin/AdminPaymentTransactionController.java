package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminPaymentTransactionResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.example.electronics.service.admin.AdminPaymentTransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Tag(
        name = "Admin - Payment Transactions",
        description = "Các API quản lý và đối soát giao dịch thanh toán dành cho Kế toán/Admin"
)
public class AdminPaymentTransactionController {

    private final AdminPaymentTransactionService adminPaymentTransactionService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách giao dịch thanh toán",
            description = "Hỗ trợ phân trang, sắp xếp và lọc theo từ khóa, loại giao dịch, trạng thái, và khoảng thời gian."
    )
    public ResponseEntity<Page<AdminPaymentTransactionResponseDTO>> getAllPaymentTransactions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PaymentTransactionType type,
            @RequestParam(required = false) PaymentTransactionStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
       Page<AdminPaymentTransactionResponseDTO> result = adminPaymentTransactionService.getAllPaymentTransactions(
               keyword, type, status, dateType, fromDate, toDate, pageable
       );

       return ResponseEntity.ok(result);
    }

    @GetMapping("/{paymentTransactionId}")
    @Operation(
            summary = "Xem chi tiết một giao dịch",
            description = "Truy xuất thông tin chi tiết của một giao dịch thanh toán dựa vào ID."
    )
    public ResponseEntity<AdminPaymentTransactionResponseDTO> getPaymentById(
            @PathVariable Integer paymentTransactionId
    ) {
        AdminPaymentTransactionResponseDTO result = adminPaymentTransactionService.getPaymentTransactionById(paymentTransactionId);

        return ResponseEntity.ok(result);
    }
}