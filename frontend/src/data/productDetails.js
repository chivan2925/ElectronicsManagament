import { products } from "./products";

const toneByCategory = {
  "điện thoại": "0A1324",
  laptop: "0D182B",
  "tai nghe": "101827",
  "chuột": "081322",
  "bàn phím": "111827",
  "lót chuột": "0F172A",
  "PC Gaming": "0B1730",
  "máy bộ": "0A1324",
  "linh kiện PC": "0D182B",
  "ghế gaming": "101827",
  "phụ kiện gaming": "081322",
};

const categoryDescriptions = {
  "điện thoại": "Thiết kế cao cấp, hiệu năng ổn định và camera sắc nét cho nhu cầu làm việc, giải trí, quay chụp hằng ngày.",
  laptop: "Màn hình đẹp, cấu hình mạnh và hệ thống tản nhiệt tối ưu cho học tập, sáng tạo nội dung và chơi game.",
  "tai nghe": "Âm trường rõ, micro sạch và kết nối ổn định để chơi game, họp online và nghe nhạc lâu dài.",
  "chuột": "Form cầm tối ưu, cảm biến chính xác và độ trễ thấp cho các trận đấu cần phản xạ nhanh.",
  "bàn phím": "Layout gọn, switch mượt, kết nối linh hoạt và đèn RGB giúp góc setup nổi bật hơn.",
  "lót chuột": "Bề mặt kiểm soát tốt, mép may chắc và kích thước rộng cho thao tác chuột thoải mái.",
  "PC Gaming": "Cấu hình gaming cân bằng, linh kiện đồng bộ và sẵn sàng nâng cấp cho các tựa game mới.",
  "máy bộ": "Máy tính đồng bộ gọn gàng, vận hành ổn định và phù hợp cho văn phòng, học tập, giải trí.",
  "linh kiện PC": "Linh kiện chính hãng, hiệu năng cao và tương thích tốt cho các cấu hình PC hiện đại.",
  "ghế gaming": "Form ngồi chắc, đệm êm và hỗ trợ tư thế tốt cho phiên chơi game hoặc làm việc dài.",
  "phụ kiện gaming": "Phụ kiện hoàn thiện setup, tăng trải nghiệm chơi game và làm việc với thao tác tiện hơn.",
};

function encodeImageText(value) {
  return encodeURIComponent(value.replace(/\s+/g, " ").trim());
}

function makeImageUrl(product, label, width = 760, height = 620) {
  const tone = toneByCategory[product.category] || "0A1324";
  return `https://placehold.co/${width}x${height}/${tone}/FFFFFF?text=${encodeImageText(label)}`;
}

function getConfigLabel(product) {
  if (product.category === "điện thoại") {
    return "Dung lượng";
  }

  if (["laptop", "PC Gaming", "máy bộ", "linh kiện PC"].includes(product.category)) {
    return "Cấu hình";
  }

  return "Phiên bản";
}

function getConfigOptions(product) {
  if (product.category === "điện thoại") {
    return [
      { id: "256gb", label: "256GB", priceDelta: 0, stock: product.stock },
      { id: "512gb", label: "512GB", priceDelta: 2_500_000, stock: Math.max(product.stock - 8, 0) },
      { id: "1tb", label: "1TB", priceDelta: 5_500_000, stock: Math.max(product.stock - 18, 0) },
    ];
  }

  if (["laptop", "PC Gaming", "máy bộ"].includes(product.category)) {
    return [
      { id: "base", label: product.tags?.slice(0, 2).join(" / ") || "Cấu hình chuẩn", priceDelta: 0, stock: product.stock },
      { id: "ram-ssd", label: "Nâng RAM / SSD", priceDelta: 1_800_000, stock: Math.max(product.stock - 5, 0) },
      { id: "creator", label: "Creator Pack", priceDelta: 3_200_000, stock: Math.max(product.stock - 10, 0) },
    ];
  }

  if (product.category === "linh kiện PC") {
    return [
      { id: "standard", label: "Bản tiêu chuẩn", priceDelta: 0, stock: product.stock },
      { id: "oc", label: "OC Edition", priceDelta: 900_000, stock: Math.max(product.stock - 4, 0) },
      { id: "bundle", label: "Bundle build PC", priceDelta: 1_400_000, stock: Math.max(product.stock - 8, 0) },
    ];
  }

  return [
    { id: "standard", label: "Tiêu chuẩn", priceDelta: 0, stock: product.stock },
    { id: "wireless", label: "Wireless Bundle", priceDelta: 450_000, stock: Math.max(product.stock - 6, 0) },
    { id: "pro-kit", label: "Pro Kit", priceDelta: 850_000, stock: Math.max(product.stock - 12, 0) },
  ];
}

function getVariantGroups(product) {
  return [
    {
      id: "color",
      label: "Màu sắc",
      options: [
        { id: "eclipse", label: "Đen Eclipse", priceDelta: 0, stock: product.stock },
        { id: "ice", label: "Bạc Ice", priceDelta: 0, stock: Math.max(product.stock - 3, 0) },
        { id: "moon", label: "Trắng Moon", priceDelta: 120_000, stock: Math.max(product.stock - 9, 0) },
      ],
    },
    {
      id: "config",
      label: getConfigLabel(product),
      options: getConfigOptions(product),
    },
    {
      id: "warranty",
      label: "Bảo hành",
      options: [
        { id: "standard-12", label: "12 tháng chính hãng", priceDelta: 0, stock: product.stock },
        { id: "premium-24", label: "24 tháng Premium", priceDelta: 690_000, stock: product.stock },
      ],
    },
  ];
}

function getSpecs(product) {
  const tagOne = product.tags?.[0] || "Hiệu năng cao";
  const tagTwo = product.tags?.[1] || "Gaming ready";
  const tagThree = product.tags?.[2] || "Chính hãng";

  const specsByCategory = {
    "điện thoại": [
      ["Màn hình", "OLED 120Hz, viền mỏng"],
      ["Chip xử lý", tagOne],
      ["Camera", tagTwo],
      ["Kết nối", tagThree],
      ["Pin", "Sạc nhanh, tối ưu cả ngày"],
    ],
    laptop: [
      ["CPU", tagOne],
      ["GPU", tagTwo],
      ["Màn hình", tagThree],
      ["RAM", "16GB trở lên"],
      ["Lưu trữ", "SSD NVMe tốc độ cao"],
    ],
    "PC Gaming": [
      ["CPU", tagOne],
      ["GPU", tagTwo],
      ["RAM", tagThree],
      ["Nguồn", "Chuẩn 80 Plus"],
      ["Tản nhiệt", "Airflow tối ưu"],
    ],
    "linh kiện PC": [
      ["Dòng sản phẩm", tagOne],
      ["Chuẩn tương thích", tagTwo],
      ["Tính năng", tagThree],
      ["Bảo hành", "Chính hãng"],
      ["Ứng dụng", "Gaming / Workstation"],
    ],
  };

  const fallbackSpecs = [
    ["Dòng sản phẩm", tagOne],
    ["Kết nối", tagTwo],
    ["Tính năng", tagThree],
    ["Bảo hành", "Chính hãng"],
    ["Phù hợp", product.category],
  ];

  return [
    ["Thương hiệu", product.brand],
    ["Danh mục", product.category],
    ...(specsByCategory[product.category] || fallbackSpecs),
    ["Mã sản phẩm", product.id],
  ].map(([label, value]) => ({ label, value }));
}

function getGallery(product) {
  return [
    { id: "main", label: "Ảnh chính", image: product.image },
    { id: "angle", label: "Góc nghiêng", image: makeImageUrl(product, `${product.name} Angle`) },
    { id: "setup", label: "Setup", image: makeImageUrl(product, `${product.brand} Setup`) },
    { id: "detail", label: "Chi tiết", image: makeImageUrl(product, `${product.tags?.[0] || product.category} Detail`) },
  ];
}

function getReviews(product) {
  return [
    {
      id: `${product.id}-rv-1`,
      author: "Minh Khang",
      date: "2026-04-28",
      rating: 5,
      title: "Đóng gói chắc, trải nghiệm đúng kỳ vọng",
      content: `Sản phẩm ${product.brand} hoàn thiện tốt, dùng ổn định và đúng mô tả. Shop tư vấn nhanh, giao hàng gọn.`,
      variant: product.tags?.[0] || product.category,
    },
    {
      id: `${product.id}-rv-2`,
      author: "Anh Tú",
      date: "2026-04-19",
      rating: Math.max(Math.round(product.rating), 4),
      title: "Hiệu năng tốt trong tầm giá",
      content: "Mình dùng vài ngày thấy mọi thứ mượt, phụ kiện đầy đủ. Điểm cộng là chính sách bảo hành rõ ràng.",
      variant: product.tags?.[1] || "Tiêu chuẩn",
    },
    {
      id: `${product.id}-rv-3`,
      author: "Gia Hân",
      date: "2026-04-11",
      rating: 4,
      title: "Thiết kế đẹp, shop hỗ trợ kỹ",
      content: "Màu sắc và cảm giác sử dụng tốt. Nếu có thêm nhiều màu sẵn hàng hơn thì sẽ hoàn hảo.",
      variant: product.tags?.[2] || "Premium",
    },
  ];
}

function getRatingBreakdown(product) {
  const fiveStar = Math.round(product.reviews * 0.72);
  const fourStar = Math.round(product.reviews * 0.2);
  const threeStar = Math.max(product.reviews - fiveStar - fourStar - 3, 0);

  return [
    { star: 5, count: fiveStar },
    { star: 4, count: fourStar },
    { star: 3, count: threeStar },
    { star: 2, count: 2 },
    { star: 1, count: 1 },
  ];
}

export function getProductDetail(slug) {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return null;
  }

  return {
    product,
    gallery: getGallery(product),
    variantGroups: getVariantGroups(product),
    specs: getSpecs(product),
    description: {
      lead: categoryDescriptions[product.category] || categoryDescriptions["phụ kiện gaming"],
      paragraphs: [
        `${product.name} là lựa chọn phù hợp cho người dùng muốn một sản phẩm ${product.category} có chất lượng ổn định, thiết kế hiện đại và trải nghiệm mua sắm rõ ràng.`,
        "Mock data hiện mô phỏng luồng PDP production-ready: biến thể, tồn kho, đánh giá, vận chuyển và sản phẩm liên quan. Khi API storefront sẵn sàng, cấu trúc này có thể chuyển sang dữ liệu thật theo DTO.",
      ],
      bullets: [
        "Hàng chính hãng, hóa đơn và bảo hành rõ ràng.",
        "Tối ưu cho nhu cầu gaming, làm việc và giải trí.",
        "Kiểm tra tồn kho theo biến thể trước khi thêm vào giỏ.",
      ],
    },
    installment: "Trả góp từ 0% qua thẻ tín dụng hoặc công ty tài chính.",
    shippingInfo: [
      "Giao nhanh nội thành trong 2-4 giờ nếu còn hàng tại kho gần nhất.",
      "Miễn phí giao hàng cho đơn từ 500.000đ.",
      "Đổi trả trong 7 ngày với sản phẩm lỗi do nhà sản xuất.",
    ],
    stockInfo: {
      status: product.stock <= 0 ? "out" : product.stock <= 10 ? "low" : "ready",
      label: product.stock <= 0 ? "Hết hàng" : product.stock <= 10 ? `Chỉ còn ${product.stock} sản phẩm` : "Còn hàng",
      warehouse: "Kho TP.HCM và Hà Nội",
    },
    reviews: getReviews(product),
    ratingBreakdown: getRatingBreakdown(product),
  };
}

export function getRelatedProducts(product, limit = 4) {
  const sameCategory = products.filter((item) => item.slug !== product.slug && item.category === product.category);
  const sameBrand = products.filter((item) => item.slug !== product.slug && item.brand === product.brand);
  const fallback = products.filter((item) => item.slug !== product.slug);
  const merged = [...sameCategory, ...sameBrand, ...fallback];

  return Array.from(new Map(merged.map((item) => [item.slug, item])).values()).slice(0, limit);
}
