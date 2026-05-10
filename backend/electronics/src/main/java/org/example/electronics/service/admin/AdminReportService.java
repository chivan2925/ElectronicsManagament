package org.example.electronics.service.admin;

import org.example.electronics.dto.response.admin.report.AdminReportDashboardResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminRevenueBucketResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminStatusBreakdownResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminTopProductResponseDTO;
import org.example.electronics.entity.enums.ReportGroupBy;

import java.time.LocalDate;
import java.util.List;

public interface AdminReportService {

    AdminReportDashboardResponseDTO getDashboardReport(LocalDate fromDate, LocalDate toDate);

    List<AdminRevenueBucketResponseDTO> getRevenueReport(LocalDate fromDate, LocalDate toDate, ReportGroupBy groupBy);

    List<AdminStatusBreakdownResponseDTO> getOrderStatusReport(LocalDate fromDate, LocalDate toDate);

    List<AdminTopProductResponseDTO> getTopProductsReport(LocalDate fromDate, LocalDate toDate, Integer limit);
}
