import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/classNames";

const routeCrumbs = {
  "/admin": [{ label: "Tổng quan", to: "/admin/dashboard" }],
  "/admin/brands": [
    { label: "Catalog", to: "/admin/products" },
    { label: "Thương hiệu" },
  ],
  "/admin/categories": [
    { label: "Catalog", to: "/admin/products" },
    { label: "Danh mục" },
  ],
  "/admin/coupons": [{ label: "Mã giảm giá" }],
  "/admin/dashboard": [{ label: "Tổng quan" }],
  "/admin/media": [
    { label: "Catalog", to: "/admin/products" },
    { label: "Hình ảnh" },
  ],
  "/admin/orders": [{ label: "Đơn hàng" }],
  "/admin/products": [
    { label: "Catalog", to: "/admin/products" },
    { label: "Sản phẩm" },
  ],
  "/admin/reports/activity": [
    { label: "Báo cáo", to: "/admin/reports/revenue" },
    { label: "Nhật ký" },
  ],
  "/admin/reports/best-sellers": [
    { label: "Báo cáo", to: "/admin/reports/revenue" },
    { label: "Bán chạy" },
  ],
  "/admin/reports/revenue": [
    { label: "Báo cáo", to: "/admin/reports/revenue" },
    { label: "Doanh thu" },
  ],
  "/admin/roles": [{ label: "Quyền & Nhóm quyền" }],
  "/admin/staff": [
    { label: "Người dùng", to: "/admin/users" },
    { label: "Nhân viên" },
  ],
  "/admin/users": [
    { label: "Người dùng", to: "/admin/users" },
    { label: "Khách hàng" },
  ],
  "/admin/variants": [
    { label: "Catalog", to: "/admin/products" },
    { label: "Biến thể" },
  ],
  "/admin/warehouse": [{ label: "Kho hàng" }],
};

function titleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function buildFallbackCrumbs(pathname) {
  return pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((segment, index, segments) => ({
      label: titleCase(segment),
      to: index < segments.length - 1 ? `/admin/${segments.slice(0, index + 1).join("/")}` : undefined,
    }));
}

function Breadcrumbs({ className }) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/admin";
  const crumbs = routeCrumbs[normalizedPath] ?? buildFallbackCrumbs(normalizedPath);
  const fullTrail = [{ label: "Quản trị", to: "/admin/dashboard" }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className={cn("flex min-w-0 items-center gap-1 text-sm", className)}>
      {fullTrail.map((crumb, index) => {
        const isLast = index === fullTrail.length - 1;
        const content = (
          <>
            {index === 0 ? <Home className="shrink-0" size={15} /> : null}
            <span className="truncate">{crumb.label}</span>
          </>
        );

        return (
          <div className="flex min-w-0 items-center gap-1" key={`${crumb.label}-${index}`}>
            {index > 0 ? <ChevronRight className="shrink-0 text-slate-400" size={15} /> : null}
            {crumb.to && !isLast ? (
              <Link
                className="flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-primary"
                to={crumb.to}
              >
                {content}
              </Link>
            ) : (
              <span className="flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 font-black text-slate-900">
                {content}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
