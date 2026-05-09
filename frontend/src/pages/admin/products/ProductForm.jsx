import { ImagePlus } from "lucide-react";
import { useMemo } from "react";
import { createProductPlaceholderImage } from "../../../api/productMapper";
import { AdminForm } from "../../../admin/components";
import { formatCurrency } from "../../../utils/formatters";

const PRODUCT_STATUS_OPTIONS = [
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

function ProductImagePreview({ values }) {
  const previewProduct = {
    category: values.categoryName,
    name: values.name || "Product",
  };
  const imageUrl = values.thumbnailUrl || values.primaryImageUrl || values.image || createProductPlaceholderImage(previewProduct);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-black text-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
          <ImagePlus size={17} />
        </span>
        Ảnh sản phẩm
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img alt={values.name || "Product preview"} className="aspect-[4/3] w-full object-cover" src={imageUrl} />
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
        Upload thật sẽ đi qua Media module. Trường này lưu URL ảnh chính để preview và tạo media chính cho sản phẩm.
      </p>
    </div>
  );
}

function ProductForm({
  brands = [],
  categories = [],
  errors = {},
  loading = false,
  mode = "create",
  onCancel,
  onChange,
  onSubmit,
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

  const fields = useMemo(
    () => [
      {
        label: "Tên sản phẩm",
        name: "name",
        placeholder: "Laptop gaming RTX 4060",
        required: true,
      },
      {
        label: "Slug",
        name: "slug",
        placeholder: "laptop-gaming-rtx-4060",
        required: true,
      },
      {
        label: "Danh mục",
        name: "categoryId",
        options: categoryOptions,
        placeholder: "Chọn danh mục",
        required: true,
        type: "select",
      },
      {
        label: "Thương hiệu",
        name: "brandId",
        options: brandOptions,
        placeholder: "Chọn thương hiệu",
        required: true,
        type: "select",
      },
      {
        helper: "Giá được tổng hợp từ biến thể thấp nhất.",
        label: "Giá hiển thị",
        name: "priceLabel",
        disabled: true,
        value: formatCurrency(values.price || 0),
      },
      {
        helper: "Tồn kho được tổng hợp từ các biến thể.",
        label: "Tồn kho",
        name: "stock",
        disabled: true,
        type: "number",
      },
      {
        label: "Ảnh chính",
        name: "thumbnailUrl",
        placeholder: "https://cdn.example.com/product.jpg",
        fullWidth: true,
      },
      {
        label: "Bảo hành (tháng)",
        min: 0,
        name: "warrantyMonths",
        placeholder: "12",
        required: true,
        type: "number",
      },
      {
        label: "Trạng thái",
        name: "status",
        options: PRODUCT_STATUS_OPTIONS,
        required: true,
        type: "select",
      },
      {
        checkboxLabel: "Đánh dấu sản phẩm nổi bật",
        label: "Nổi bật",
        name: "featured",
        type: "checkbox",
      },
      {
        fullWidth: true,
        label: "Mô tả",
        name: "description",
        placeholder: "Mô tả ngắn về sản phẩm, điểm nổi bật và đối tượng phù hợp...",
        type: "textarea",
      },
      {
        fullWidth: true,
        helper: 'Mỗi dòng dùng dạng "CPU: Intel Core i7" hoặc nhập JSON object.',
        label: "Thông số chung",
        name: "specsText",
        placeholder: "CPU: Intel Core i7\nRAM: 16GB\nBảo hành: 24 tháng",
        type: "textarea",
      },
    ],
    [brandOptions, categoryOptions, values.price],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
      <ProductImagePreview values={values} />

      <AdminForm
        errors={errors}
        fields={fields}
        loading={loading}
        onCancel={onCancel}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel={mode === "edit" ? "Lưu thay đổi" : "Tạo sản phẩm"}
        values={{
          ...values,
          priceLabel: formatCurrency(values.price || 0),
        }}
      />
    </div>
  );
}

export default ProductForm;
