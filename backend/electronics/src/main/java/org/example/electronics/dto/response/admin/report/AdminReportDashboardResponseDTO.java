package org.example.electronics.dto.response.admin.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record AdminReportDashboardResponseDTO(
        LocalDateTime generatedAt,
        LocalDate fromDate,
        LocalDate toDate,
        Long orderCount,
        Long revenueOrderCount,
        Long paidOrderCount,
        Long completedOrderCount,
        Long pendingOrderCount,
        Long cancelledOrderCount,
        Integer itemCount,
        BigDecimal revenue,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal shippingFee,
        BigDecimal averageOrderValue,
        List<AdminRevenueBucketResponseDTO> revenueSeries,
        List<AdminStatusBreakdownResponseDTO> orderStatusBreakdown,
        List<AdminTopProductResponseDTO> topProducts
) {
}
