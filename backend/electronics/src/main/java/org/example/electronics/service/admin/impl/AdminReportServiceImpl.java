package org.example.electronics.service.admin.impl;

import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.report.AdminReportDashboardResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminRevenueBucketResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminStatusBreakdownResponseDTO;
import org.example.electronics.dto.response.admin.report.AdminTopProductResponseDTO;
import org.example.electronics.entity.ProductEntity;
import org.example.electronics.entity.VariantEntity;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.ReportGroupBy;
import org.example.electronics.entity.order.OrderDetailEntity;
import org.example.electronics.entity.order.OrderEntity;
import org.example.electronics.repository.OrderRepository;
import org.example.electronics.service.admin.AdminReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService {

    private static final int DEFAULT_DASHBOARD_TOP_PRODUCT_LIMIT = 5;
    private static final int DEFAULT_TOP_PRODUCT_LIMIT = 10;
    private static final int MAX_TOP_PRODUCT_LIMIT = 50;
    private static final Set<OrderStatus> NON_REVENUE_STATUSES = Set.of(
            OrderStatus.CANCELLED,
            OrderStatus.REFUNDED,
            OrderStatus.RETURNED
    );

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    @Override
    public AdminReportDashboardResponseDTO getDashboardReport(LocalDate fromDate, LocalDate toDate) {
        ReportRange range = resolveRange(fromDate, toDate);
        List<OrderEntity> orders = getOrders(range);
        List<OrderEntity> revenueOrders = getRevenueOrders(orders);
        ReportTotals totals = calculateTotals(revenueOrders);

        return new AdminReportDashboardResponseDTO(
                LocalDateTime.now(),
                range.fromDate(),
                range.toDate(),
                (long) orders.size(),
                (long) revenueOrders.size(),
                countByPaymentStatus(orders, PaymentStatus.PAID),
                countByOrderStatus(orders, OrderStatus.COMPLETED),
                countByOrderStatus(orders, OrderStatus.PENDING),
                countByOrderStatus(orders, OrderStatus.CANCELLED),
                totals.itemCount(),
                totals.revenue(),
                totals.subtotal(),
                totals.discount(),
                totals.shippingFee(),
                calculateAverage(totals.revenue(), revenueOrders.size()),
                buildRevenueBuckets(orders, range, ReportGroupBy.DAY),
                buildStatusBreakdown(orders),
                buildTopProducts(orders, DEFAULT_DASHBOARD_TOP_PRODUCT_LIMIT)
        );
    }

    @Transactional(readOnly = true)
    @Override
    public List<AdminRevenueBucketResponseDTO> getRevenueReport(
            LocalDate fromDate,
            LocalDate toDate,
            ReportGroupBy groupBy
    ) {
        ReportRange range = resolveRange(fromDate, toDate);

        return buildRevenueBuckets(getOrders(range), range, groupBy == null ? ReportGroupBy.DAY : groupBy);
    }

    @Transactional(readOnly = true)
    @Override
    public List<AdminStatusBreakdownResponseDTO> getOrderStatusReport(LocalDate fromDate, LocalDate toDate) {
        return buildStatusBreakdown(getOrders(resolveRange(fromDate, toDate)));
    }

    @Transactional(readOnly = true)
    @Override
    public List<AdminTopProductResponseDTO> getTopProductsReport(LocalDate fromDate, LocalDate toDate, Integer limit) {
        return buildTopProducts(getOrders(resolveRange(fromDate, toDate)), clampLimit(limit));
    }

    private List<OrderEntity> getOrders(ReportRange range) {
        return orderRepository.findOrdersForReport(range.fromDateTime(), range.toDateTime());
    }

    private ReportRange resolveRange(LocalDate fromDate, LocalDate toDate) {
        LocalDate resolvedToDate = toDate == null ? LocalDate.now() : toDate;
        LocalDate resolvedFromDate = fromDate == null ? resolvedToDate.minusDays(29) : fromDate;

        if (resolvedFromDate.isAfter(resolvedToDate)) {
            throw new IllegalArgumentException("Ngày bắt đầu báo cáo không được sau ngày kết thúc");
        }

        return new ReportRange(
                resolvedFromDate,
                resolvedToDate,
                resolvedFromDate.atStartOfDay(),
                resolvedToDate.plusDays(1).atStartOfDay().minusNanos(1)
        );
    }

    private List<OrderEntity> getRevenueOrders(List<OrderEntity> orders) {
        return orders.stream()
                .filter(this::isRevenueOrder)
                .toList();
    }

    private boolean isRevenueOrder(OrderEntity order) {
        if (order.getStatus() == null || NON_REVENUE_STATUSES.contains(order.getStatus())) {
            return false;
        }

        return order.getStatus() == OrderStatus.COMPLETED || order.getPaymentStatus() == PaymentStatus.PAID;
    }

    private ReportTotals calculateTotals(List<OrderEntity> orders) {
        ReportTotals totals = new ReportTotals();

        orders.forEach((order) -> {
            totals.revenue = totals.revenue.add(toMoney(order.getTotal()));
            totals.subtotal = totals.subtotal.add(toMoney(order.getSubtotal()));
            totals.discount = totals.discount.add(toMoney(order.getDiscount()));
            totals.shippingFee = totals.shippingFee.add(toMoney(order.getShippingFee()));
            totals.itemCount += getOrderItemCount(order);
        });

        return totals;
    }

    private List<AdminRevenueBucketResponseDTO> buildRevenueBuckets(
            List<OrderEntity> orders,
            ReportRange range,
            ReportGroupBy groupBy
    ) {
        Map<String, RevenueBucketAccumulator> buckets = createBucketAccumulators(range, groupBy);

        orders.forEach((order) -> {
            String bucketKey = getBucketKey(order.getCreatedAt().toLocalDate(), groupBy);
            RevenueBucketAccumulator bucket = buckets.get(bucketKey);

            if (bucket == null) {
                return;
            }

            bucket.orderCount++;

            if (!isRevenueOrder(order)) {
                return;
            }

            bucket.revenueOrderCount++;
            bucket.revenue = bucket.revenue.add(toMoney(order.getTotal()));
            bucket.subtotal = bucket.subtotal.add(toMoney(order.getSubtotal()));
            bucket.discount = bucket.discount.add(toMoney(order.getDiscount()));
            bucket.shippingFee = bucket.shippingFee.add(toMoney(order.getShippingFee()));
            bucket.itemCount += getOrderItemCount(order);
        });

        return buckets.values().stream()
                .map(RevenueBucketAccumulator::toResponseDTO)
                .toList();
    }

    private Map<String, RevenueBucketAccumulator> createBucketAccumulators(ReportRange range, ReportGroupBy groupBy) {
        Map<String, RevenueBucketAccumulator> buckets = new LinkedHashMap<>();
        LocalDate cursor = getBucketStart(range.fromDate(), groupBy);
        LocalDate lastBucketStart = getBucketStart(range.toDate(), groupBy);

        while (!cursor.isAfter(lastBucketStart)) {
            LocalDate nextBucketStart = getNextBucketStart(cursor, groupBy);
            LocalDate bucketEnd = nextBucketStart.minusDays(1).isAfter(range.toDate())
                    ? range.toDate()
                    : nextBucketStart.minusDays(1);

            RevenueBucketAccumulator bucket = new RevenueBucketAccumulator(
                    getBucketKey(cursor, groupBy),
                    getBucketLabel(cursor, groupBy),
                    cursor.isBefore(range.fromDate()) ? range.fromDate() : cursor,
                    bucketEnd
            );

            buckets.put(bucket.period, bucket);
            cursor = nextBucketStart;
        }

        return buckets;
    }

    private String getBucketKey(LocalDate date, ReportGroupBy groupBy) {
        return switch (groupBy) {
            case MONTH -> YearMonth.from(date).toString();
            case YEAR -> String.valueOf(date.getYear());
            case DAY -> date.toString();
        };
    }

    private String getBucketLabel(LocalDate date, ReportGroupBy groupBy) {
        return switch (groupBy) {
            case MONTH -> "%02d/%d".formatted(date.getMonthValue(), date.getYear());
            case YEAR -> String.valueOf(date.getYear());
            case DAY -> date.toString();
        };
    }

    private LocalDate getBucketStart(LocalDate date, ReportGroupBy groupBy) {
        return switch (groupBy) {
            case MONTH -> date.withDayOfMonth(1);
            case YEAR -> date.withDayOfYear(1);
            case DAY -> date;
        };
    }

    private LocalDate getNextBucketStart(LocalDate date, ReportGroupBy groupBy) {
        return switch (groupBy) {
            case MONTH -> date.plusMonths(1).withDayOfMonth(1);
            case YEAR -> date.plusYears(1).withDayOfYear(1);
            case DAY -> date.plusDays(1);
        };
    }

    private List<AdminStatusBreakdownResponseDTO> buildStatusBreakdown(List<OrderEntity> orders) {
        Map<OrderStatus, StatusAccumulator> statusCounts = new EnumMap<>(OrderStatus.class);
        long totalOrders = orders.size();

        for (OrderStatus status : OrderStatus.values()) {
            statusCounts.put(status, new StatusAccumulator(status));
        }

        orders.forEach((order) -> {
            OrderStatus status = order.getStatus();

            if (status == null) {
                return;
            }

            StatusAccumulator accumulator = statusCounts.get(status);
            accumulator.count++;
            accumulator.amount = accumulator.amount.add(toMoney(order.getTotal()));
        });

        return statusCounts.values().stream()
                .map((accumulator) -> accumulator.toResponseDTO(totalOrders))
                .toList();
    }

    private List<AdminTopProductResponseDTO> buildTopProducts(List<OrderEntity> orders, Integer limit) {
        Map<Integer, TopProductAccumulator> productSales = new LinkedHashMap<>();

        getRevenueOrders(orders).forEach((order) -> order.getOrderDetails().forEach((detail) -> {
            VariantEntity variant = detail.getVariant();
            ProductEntity product = variant == null ? null : variant.getProduct();

            if (product == null) {
                return;
            }

            TopProductAccumulator accumulator = productSales.computeIfAbsent(
                    product.getId(),
                    (productId) -> new TopProductAccumulator(product)
            );

            accumulator.quantitySold += detail.getQuantity() == null ? 0 : detail.getQuantity();
            accumulator.revenue = accumulator.revenue.add(
                    toMoney(detail.getPrice()).multiply(BigDecimal.valueOf(detail.getQuantity() == null ? 0 : detail.getQuantity()))
            );
            accumulator.orderIds.add(order.getId());
        }));

        return productSales.values().stream()
                .sorted(Comparator
                        .comparing(TopProductAccumulator::getRevenue).reversed()
                        .thenComparing(TopProductAccumulator::getQuantitySold, Comparator.reverseOrder())
                        .thenComparing((product) -> product.productName))
                .limit(clampLimit(limit))
                .map(TopProductAccumulator::toResponseDTO)
                .toList();
    }

    private int getOrderItemCount(OrderEntity order) {
        if (order.getOrderDetails() == null) {
            return 0;
        }

        return order.getOrderDetails().stream()
                .mapToInt((detail) -> detail.getQuantity() == null ? 0 : detail.getQuantity())
                .sum();
    }

    private long countByOrderStatus(List<OrderEntity> orders, OrderStatus status) {
        return orders.stream()
                .filter((order) -> order.getStatus() == status)
                .count();
    }

    private long countByPaymentStatus(List<OrderEntity> orders, PaymentStatus status) {
        return orders.stream()
                .filter((order) -> order.getPaymentStatus() == status)
                .count();
    }

    private int clampLimit(Integer limit) {
        int resolvedLimit = limit == null ? DEFAULT_TOP_PRODUCT_LIMIT : limit;

        return Math.min(Math.max(resolvedLimit, 1), MAX_TOP_PRODUCT_LIMIT);
    }

    private BigDecimal calculateAverage(BigDecimal total, int count) {
        if (count <= 0) {
            return BigDecimal.ZERO;
        }

        return total.divide(BigDecimal.valueOf(count), 3, RoundingMode.HALF_UP);
    }

    private BigDecimal toMoney(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private record ReportRange(
            LocalDate fromDate,
            LocalDate toDate,
            LocalDateTime fromDateTime,
            LocalDateTime toDateTime
    ) {
    }

    private static class ReportTotals {
        private BigDecimal revenue = BigDecimal.ZERO;
        private BigDecimal subtotal = BigDecimal.ZERO;
        private BigDecimal discount = BigDecimal.ZERO;
        private BigDecimal shippingFee = BigDecimal.ZERO;
        private int itemCount = 0;

        private BigDecimal revenue() {
            return revenue;
        }

        private BigDecimal subtotal() {
            return subtotal;
        }

        private BigDecimal discount() {
            return discount;
        }

        private BigDecimal shippingFee() {
            return shippingFee;
        }

        private Integer itemCount() {
            return itemCount;
        }
    }

    private static class RevenueBucketAccumulator {
        private final String period;
        private final String label;
        private final LocalDate startDate;
        private final LocalDate endDate;
        private long orderCount = 0;
        private long revenueOrderCount = 0;
        private int itemCount = 0;
        private BigDecimal revenue = BigDecimal.ZERO;
        private BigDecimal subtotal = BigDecimal.ZERO;
        private BigDecimal discount = BigDecimal.ZERO;
        private BigDecimal shippingFee = BigDecimal.ZERO;

        private RevenueBucketAccumulator(String period, String label, LocalDate startDate, LocalDate endDate) {
            this.period = period;
            this.label = label;
            this.startDate = startDate;
            this.endDate = endDate;
        }

        private AdminRevenueBucketResponseDTO toResponseDTO() {
            return new AdminRevenueBucketResponseDTO(
                    period,
                    label,
                    startDate,
                    endDate,
                    orderCount,
                    revenueOrderCount,
                    itemCount,
                    revenue,
                    subtotal,
                    discount,
                    shippingFee
            );
        }
    }

    private static class StatusAccumulator {
        private final OrderStatus status;
        private long count = 0;
        private BigDecimal amount = BigDecimal.ZERO;

        private StatusAccumulator(OrderStatus status) {
            this.status = status;
        }

        private AdminStatusBreakdownResponseDTO toResponseDTO(long totalOrders) {
            double percentage = totalOrders == 0 ? 0 : (count * 100.0) / totalOrders;

            return new AdminStatusBreakdownResponseDTO(
                    status.name(),
                    status.name(),
                    count,
                    amount,
                    percentage
            );
        }
    }

    private static class TopProductAccumulator {
        private final Integer productId;
        private final String productName;
        private final Integer categoryId;
        private final String categoryName;
        private final Integer brandId;
        private final String brandName;
        private final List<Integer> orderIds = new ArrayList<>();
        private int quantitySold = 0;
        private BigDecimal revenue = BigDecimal.ZERO;

        private TopProductAccumulator(ProductEntity product) {
            this.productId = product.getId();
            this.productName = product.getName();
            this.categoryId = product.getCategory() == null ? null : product.getCategory().getId();
            this.categoryName = product.getCategory() == null ? null : product.getCategory().getName();
            this.brandId = product.getBrand() == null ? null : product.getBrand().getId();
            this.brandName = product.getBrand() == null ? null : product.getBrand().getName();
        }

        private BigDecimal getRevenue() {
            return revenue;
        }

        private Integer getQuantitySold() {
            return quantitySold;
        }

        private AdminTopProductResponseDTO toResponseDTO() {
            return new AdminTopProductResponseDTO(
                    productId,
                    productName,
                    categoryId,
                    categoryName,
                    brandId,
                    brandName,
                    orderIds.stream().distinct().count(),
                    quantitySold,
                    revenue
            );
        }
    }
}
