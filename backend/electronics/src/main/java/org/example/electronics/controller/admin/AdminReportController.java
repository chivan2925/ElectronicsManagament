package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.report.AdminReportDashboardResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminRevenueBucketResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminStatusBreakdownResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminTopProductResponseDTO;
import org.example.electronics.entity.enums.ReportGroupBy;
import org.example.electronics.service.admin.AdminReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@Tag(name = "Admin - Báo cáo", description = "Các API tổng hợp doanh thu, trạng thái đơn hàng và sản phẩm bán chạy")
public class AdminReportController {

    private final AdminReportService adminReportService;

    @GetMapping("/dashboard")
    @Operation(
            summary = "Lấy số liệu tổng quan dashboard",
            description = "Trả về doanh thu, số đơn, trạng thái đơn, chuỗi doanh thu theo ngày và top sản phẩm trong khoảng ngày."
    )
    public ResponseEntity<AdminReportDashboardResponseDTO> getDashboardReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(adminReportService.getDashboardReport(fromDate, toDate));
    }

    @GetMapping("/revenue")
    @Operation(
            summary = "Lấy chuỗi doanh thu",
            description = "Trả về dữ liệu doanh thu nhóm theo ngày, tháng hoặc năm để vẽ biểu đồ."
    )
    public ResponseEntity<List<AdminRevenueBucketResponseDTO>> getRevenueReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "DAY") ReportGroupBy groupBy
    ) {
        return ResponseEntity.ok(adminReportService.getRevenueReport(fromDate, toDate, groupBy));
    }

    @GetMapping("/order-status")
    @Operation(
            summary = "Lấy thống kê trạng thái đơn hàng",
            description = "Trả về số lượng và tỷ trọng đơn theo từng trạng thái trong khoảng ngày."
    )
    public ResponseEntity<List<AdminStatusBreakdownResponseDTO>> getOrderStatusReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(adminReportService.getOrderStatusReport(fromDate, toDate));
    }

    @GetMapping("/top-products")
    @Operation(
            summary = "Lấy sản phẩm bán chạy",
            description = "Trả về danh sách sản phẩm bán chạy theo số lượng và doanh thu trong khoảng ngày."
    )
    public ResponseEntity<List<AdminTopProductResponseDTO>> getTopProductsReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        return ResponseEntity.ok(adminReportService.getTopProductsReport(fromDate, toDate, limit));
    }
}
