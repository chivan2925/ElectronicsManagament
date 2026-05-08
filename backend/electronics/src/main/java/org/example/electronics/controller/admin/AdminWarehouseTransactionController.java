package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.status.AdminUpdateWarehouseTransactionTypeStatusRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.transaction.AdminWarehouseTransactionRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.transaction.AdminWarehouseTransactionResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.WarehouseTransactionStatus;
import org.example.electronics.entity.enums.WarehouseTransactionType;
import org.example.electronics.security.auth.admin.StaffDetails;
import org.example.electronics.service.admin.AdminWarehouseTransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/warehouse-transactions")
@RequiredArgsConstructor
@Tag(
        name = "Admin - Quản lý Giao dịch Kho",
        description = "Các API dành cho Admin để tạo, duyệt và quản lý các phiếu nhập/xuất/hoàn trả kho"
)
public class AdminWarehouseTransactionController {

    private final AdminWarehouseTransactionService adminWarehouseTransactionService;

    @PostMapping
    @Operation(
            summary = "Tạo phiếu giao dịch kho mới (Bản nháp)",
            description = "Tạo một phiếu nhập/xuất/hoàn kho với trạng thái mặc định. Lưu ý: Thao tác này CHƯA làm thay đổi số lượng tồn kho thực tế của hệ thống."
    )
    public ResponseEntity<AdminWarehouseTransactionResponseDTO> createWarehouseTransaction(
            @Valid @RequestBody AdminWarehouseTransactionRequestDTO requestDTO,
            @AuthenticationPrincipal StaffDetails staffDetails
    ) {
        Integer staffId = staffDetails.getId();

        AdminWarehouseTransactionResponseDTO responseDTO = adminWarehouseTransactionService.createWarehouseTransaction(requestDTO, staffId);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PutMapping("/{warehouseTransactionId}")
    @Operation(
            summary = "Cập nhật phiếu giao dịch kho",
            description = "Cho phép sửa đổi thông tin hoặc danh sách sản phẩm bên trong phiếu. Chỉ áp dụng cho các phiếu đang ở trạng thái nháp (PENDING)."
    )
    public ResponseEntity<AdminWarehouseTransactionResponseDTO> updateWarehouseTransaction(
            @PathVariable Integer warehouseTransactionId,
            @Valid @RequestBody AdminWarehouseTransactionRequestDTO requestDTO,
            @AuthenticationPrincipal StaffDetails staffDetails
    ) {
       Integer staffId = staffDetails.getId();

       AdminWarehouseTransactionResponseDTO responseDTO = adminWarehouseTransactionService.updateWarehouseTransaction(warehouseTransactionId, requestDTO, staffId);

       return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/{warehouseTransactionId}/status")
    @Operation(
            summary = "Duyệt / Cập nhật trạng thái phiếu kho (Chốt sổ ERP)",
            description = "Cực kỳ quan trọng: Khi trạng thái được chuyển sang COMPLETED, hệ thống sẽ chính thức thực thi tính toán (cộng/trừ) Tồn kho vật lý thực tế."
    )
    public ResponseEntity<AdminWarehouseTransactionResponseDTO> updateStatusWarehouseTransaction(
            @PathVariable Integer warehouseTransactionId,
            @Valid @RequestBody AdminUpdateWarehouseTransactionTypeStatusRequestDTO requestDTO,
            @AuthenticationPrincipal StaffDetails staffDetails
    ) {
        Integer staffId = staffDetails.getId();

        AdminWarehouseTransactionResponseDTO responseDTO = adminWarehouseTransactionService.updateStatusWarehouseTransaction(warehouseTransactionId, requestDTO, staffId);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{warehouseTransactionId}")
    @Operation(
            summary = "Xóa / Hủy phiếu giao dịch",
            description = "Đánh dấu xóa một phiếu giao dịch. Thao tác này sẽ bị chặn nếu phiếu đã được chốt sổ (COMPLETED)."
    )
    public ResponseEntity<AdminWarehouseTransactionResponseDTO> deleteWarehouseTransaction(
            @PathVariable Integer warehouseTransactionId,
            @AuthenticationPrincipal StaffDetails staffDetails
    ) {
        Integer staffId = staffDetails.getId();

        adminWarehouseTransactionService.deleteWarehouseTransaction(warehouseTransactionId, staffId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách phiếu giao dịch kho (có phân trang)",
            description = "Tra cứu và lọc phiếu kho theo từ khóa (Mã phiếu, ID), loại giao dịch (IMPORT/EXPORT/RETURN), trạng thái, và thời gian. Các phiếu có cập nhật mới nhất sẽ tự động lên đầu."
    )
    public ResponseEntity<Page<AdminWarehouseTransactionResponseDTO>> getAllWarehouseTransactions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) WarehouseTransactionType type,
            @RequestParam(required = false) WarehouseTransactionStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminWarehouseTransactionResponseDTO> responseDTOPage = adminWarehouseTransactionService.getAllWarehouseTransactions(keyword, type, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(responseDTOPage);
    }

    @Operation(
            summary = "Xem chi tiết một phiếu giao dịch kho",
            description = "Lấy thông tin tổng quan của phiếu kèm theo danh sách chi tiết các mặt hàng (mã sản phẩm, tên, số lượng) bên trong."
    )
    @GetMapping("/{warehouseTransactionId}")
    public ResponseEntity<AdminWarehouseTransactionResponseDTO> getWarehouseTransactionById(
            @PathVariable Integer warehouseTransactionId
    ) {
        AdminWarehouseTransactionResponseDTO responseDTO = adminWarehouseTransactionService.getWarehouseTransactionById(warehouseTransactionId);

        return ResponseEntity.ok(responseDTO);
    }
}
