import { useMemo } from "react";
import { AdminFilters, AdminSearch } from "../../../admin/components";

const STATUS_OPTIONS = [
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

const FEATURED_OPTIONS = [
  { label: "Nổi bật", value: "true" },
  { label: "Không nổi bật", value: "false" },
];

function ProductFilters({
  brands = [],
  categories = [],
  disabled = false,
  onChange,
  onReset,
  query = "",
  values = {},
}) {
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
    [categories],
  );

  const brandOptions = useMemo(
    () =>
      brands.map((brand) => ({
        label: brand.name,
        value: String(brand.id),
      })),
    [brands],
  );

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(460px,0.75fr)]">
      <AdminSearch
        disabled={disabled}
        onChange={(nextValue) => onChange?.("query", nextValue)}
        placeholder="Tìm theo tên, slug hoặc mã sản phẩm..."
        value={query}
      />

      <AdminFilters
        className="p-3"
        filters={[
          {
            key: "categoryId",
            label: "Danh mục",
            options: categoryOptions,
            placeholder: "Tất cả danh mục",
            type: "select",
          },
          {
            key: "brandId",
            label: "Thương hiệu",
            options: brandOptions,
            placeholder: "Tất cả thương hiệu",
            type: "select",
          },
          {
            key: "status",
            label: "Trạng thái",
            options: STATUS_OPTIONS,
            placeholder: "Tất cả trạng thái",
            type: "select",
          },
          {
            key: "featured",
            label: "Nổi bật",
            options: FEATURED_OPTIONS,
            placeholder: "Tất cả",
            type: "select",
          },
        ]}
        onChange={onChange}
        onReset={onReset}
        summary="Lọc nhanh catalog"
        title="Bộ lọc"
        values={values}
      />
    </div>
  );
}

export default ProductFilters;
