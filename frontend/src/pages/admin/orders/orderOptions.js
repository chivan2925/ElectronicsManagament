export const ORDER_STAGE_OPTIONS = [
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang giao hàng", value: "shipping" },
  { label: "Đã giao hàng", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "Chờ thanh toán", value: "PENDING" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Thất bại", value: "FAILED" },
  { label: "Đã hủy", value: "CANCELLED" },
  { label: "Đã hoàn tiền", value: "REFUNDED" },
];

export const SHIPPING_STATUS_OPTIONS = [
  { label: "Chờ lấy hàng", value: "PENDING" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã trả hàng", value: "RETURNED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

export const SHIPPING_PROVIDER_OPTIONS = [
  { label: "GHN", value: "GHN" },
  { label: "GHTK", value: "GHTK" },
  { label: "Viettel Post", value: "VIETTELPOST" },
  { label: "VNPost", value: "VNPOST" },
  { label: "Khác", value: "OTHER" },
];
