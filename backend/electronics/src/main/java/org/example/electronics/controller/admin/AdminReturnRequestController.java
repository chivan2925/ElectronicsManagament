package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.status.AdminUpdateReturnRequestStatusRequestDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminDetailReturnRequestResponseDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminReturnRequestResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ReturnRequestStatus;
import org.example.electronics.security.auth.admin.StaffDetails;
import org.example.electronics.service.admin.AdminReturnRequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/return-requests")
@RequiredArgsConstructor
@Tag(
        name = "7. Return Request Management",
        description = "Các API dành cho Admin để quản lý Yêu cầu Hoàn trả/Hoàn tiền của khách hàng. Bao gồm luồng xử lý duyệt/từ chối và tích hợp tự động nhập kho hàng hoàn."
)
public class AdminReturnRequestController {

    private final AdminReturnRequestService adminReturnRequestService;

    @PatchMapping("/{returnRequestId}")
    @Operation(
            summary = "Cập nhật trạng thái Yêu cầu Hoàn trả",
            description = "Thay đổi trạng thái của Yêu cầu Hoàn trả (VD: APPROVED, REJECTED, COMPLETED). Ghi nhận người xử lý là Admin hiện tại. LƯU Ý: Nếu đổi sang trạng thái được chấp thuận nhận lại hàng, hệ thống sẽ tự động truy vết kho xuất gốc và tạo Phiếu nhập kho hoàn trả."
    )
    public ResponseEntity<AdminReturnRequestResponseDTO> updateStatusReturnRequest(
            @PathVariable Integer returnRequestId,
            @Valid @RequestBody AdminUpdateReturnRequestStatusRequestDTO requestDTO,
            @AuthenticationPrincipal StaffDetails staffDetails
    ) {
        Integer staffId = staffDetails.getId();

        AdminReturnRequestResponseDTO returnRequestResponseDTO = adminReturnRequestService.updateStatusReturnRequest(returnRequestId, requestDTO, staffId);

        return ResponseEntity.ok(returnRequestResponseDTO);
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách Yêu cầu Hoàn trả (Có phân trang & Lọc)",
            description = "Truy xuất danh sách yêu cầu hoàn trả. Trả về DTO rút gọn (không chứa danh sách ảnh bằng chứng) để tối ưu băng thông cho màn hình bảng danh sách. Hỗ trợ tìm kiếm theo ID/Mã đơn, trạng thái và khoảng thời gian."
    )
    public ResponseEntity<Page<AdminReturnRequestResponseDTO>> getAllReturnRequests(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ReturnRequestStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminReturnRequestResponseDTO> returnRequestResponseDTOPage = adminReturnRequestService.getAllReturnRequests(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(returnRequestResponseDTOPage);
    }

    @GetMapping("/{returnRequestId}")
    @Operation(
            summary = "Xem chi tiết 1 Yêu cầu Hoàn trả",
            description = "Lấy toàn bộ thông tin chi tiết của 1 yêu cầu hoàn trả. Trả về DTO chi tiết, CÓ BAO GỒM danh sách các link ảnh/video bằng chứng (evidenceJson) và lý do đầy đủ để Admin tiến hành kiểm duyệt."
    )
    public ResponseEntity<AdminDetailReturnRequestResponseDTO> getReturnRequestById(
            @PathVariable Integer returnRequestId
    ) {
        AdminDetailReturnRequestResponseDTO adminDetailReturnRequestResponseDTO = adminReturnRequestService.getReturnRequestById(returnRequestId);

        return ResponseEntity.ok(adminDetailReturnRequestResponseDTO);
    }
}
