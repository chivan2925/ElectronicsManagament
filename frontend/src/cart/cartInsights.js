export const FREE_SHIPPING_THRESHOLD = 5_000_000;
export const STANDARD_SHIPPING_FEE = 45_000;

export function getFreeShippingState(subtotal = 0, threshold = FREE_SHIPPING_THRESHOLD) {
  const safeSubtotal = Math.max(Number(subtotal) || 0, 0);
  const safeThreshold = Math.max(Number(threshold) || FREE_SHIPPING_THRESHOLD, 1);
  const remaining = Math.max(safeThreshold - safeSubtotal, 0);
  const progress = Math.min(Math.round((safeSubtotal / safeThreshold) * 100), 100);

  return {
    isUnlocked: remaining <= 0,
    progress,
    remaining,
    threshold: safeThreshold,
  };
}

export function getStandardShippingAmount(subtotal = 0) {
  return getFreeShippingState(subtotal).isUnlocked ? 0 : STANDARD_SHIPPING_FEE;
}

export function getCartStockInsights(items = []) {
  const stockIssues = [];
  const stockWarnings = [];

  items.forEach((item) => {
    const maxQuantity = Number(item.maxQuantity ?? item.product?.stock ?? 0);
    const quantity = Number(item.quantity ?? 0);
    const productName = item.product?.name ?? "Sản phẩm";

    if (maxQuantity <= 0 || quantity > maxQuantity) {
      stockIssues.push({
        id: item.id,
        maxQuantity: Math.max(maxQuantity, 0),
        message: maxQuantity <= 0 ? "Sản phẩm đang hết hàng." : `Chỉ còn ${maxQuantity} sản phẩm khả dụng.`,
        productName,
        quantity,
      });
      return;
    }

    if (maxQuantity <= 5 || quantity >= maxQuantity) {
      stockWarnings.push({
        id: item.id,
        maxQuantity,
        message: quantity >= maxQuantity ? "Bạn đã chọn tối đa tồn kho khả dụng." : `Chỉ còn ${maxQuantity} sản phẩm.`,
        productName,
        quantity,
      });
    }
  });

  return {
    hasBlockingIssues: stockIssues.length > 0,
    hasWarnings: stockWarnings.length > 0,
    stockIssues,
    stockWarnings,
  };
}

export function getShippingEstimate({ city = "", shippingMethod, subtotal = 0 } = {}) {
  const normalizedCity = String(city || "").trim();
  const lowerCity = normalizedCity.toLowerCase();
  const isUrban =
    lowerCity.includes("hồ chí minh") ||
    lowerCity.includes("ho chi minh") ||
    lowerCity.includes("hcm") ||
    lowerCity.includes("hà nội") ||
    lowerCity.includes("ha noi");
  const methodId = shippingMethod?.id || "standard";
  const methodPrice =
    typeof shippingMethod?.price === "number" ? shippingMethod.price : getStandardShippingAmount(subtotal);

  if (methodId === "pickup") {
    return {
      destination: "Nhận tại cửa hàng",
      eta: "Trong ngày",
      fee: 0,
      note: "Shop sẽ xác nhận khi đơn sẵn sàng để nhận.",
    };
  }

  if (methodId === "express") {
    return {
      destination: normalizedCity || "Địa chỉ giao hàng",
      eta: isUrban ? "Dự kiến 1 ngày" : "Dự kiến 1-2 ngày",
      fee: methodPrice,
      note: "Ưu tiên xử lý và bàn giao đơn trong ngày làm việc.",
    };
  }

  return {
    destination: normalizedCity || "Địa chỉ giao hàng",
    eta: isUrban ? "Dự kiến 1-2 ngày" : "Dự kiến 2-4 ngày",
    fee: methodPrice,
    note: "Thời gian có thể thay đổi theo tồn kho và khu vực giao hàng.",
  };
}
