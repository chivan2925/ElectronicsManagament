import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { cloneElement, isValidElement, useMemo } from "react";
import { normalizeSlug } from "../../../api/productMapper";
import FormFieldMessage from "../../../components/ui/form/FormFieldMessage";
import OptimizedImage from "../../../components/common/OptimizedImage";
import { cn } from "../../../utils/classNames";
import { formatCurrency } from "../../../utils/formatters";
import { getFormFieldDescribedBy } from "../../../utils/formValidation";

const STATUS_OPTIONS = [
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

function Field({ children, error, helper, id, label, required }) {
  const fieldId = id || label;
  const hasError = Boolean(error);
  const hasHelper = Boolean(helper);
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const describedBy = getFormFieldDescribedBy({ errorId, hasError, hasHelper, helperId });
  const canEnhanceChild = isValidElement(children) && ["input", "select", "textarea"].includes(children.type);
  const content = canEnhanceChild
    ? cloneElement(children, {
        "aria-describedby": describedBy,
        "aria-invalid": hasError,
        className: cn(children.props.className, hasError && "border-rose-300 ring-2 ring-rose-100"),
        id: children.props.id || fieldId,
        name: children.props.name || fieldId,
      })
    : children;

  return (
    <div className="space-y-1.5" data-field-name={fieldId}>
      <label className="block text-sm font-black text-slate-700" htmlFor={fieldId}>
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>
      {content}
      <FormFieldMessage id={errorId} surface="admin" tone="error">
        {error}
      </FormFieldMessage>
      {!error && (
        <FormFieldMessage id={helperId} surface="admin" tone="helper">
          {helper}
        </FormFieldMessage>
      )}
    </div>
  );
}

function VariantForm({
  errors = {},
  loading = false,
  mode = "create",
  onCancel,
  onChange,
  onSubmit,
  products = [],
  values = {},
}) {
  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: product.name,
        value: String(product.apiId ?? product.id),
      })),
    [products],
  );
  const attributeRows = values.attributeRows?.length ? values.attributeRows : [{ key: "", value: "" }];
  const imagePreview = values.thumbnailUrl || values.primaryImageUrl || values.image;
  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
  const textareaClass =
    "min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  const updateAttribute = (index, key, value) => {
    const nextRows = attributeRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
    onChange?.("attributeRows", nextRows);
  };

  const addAttribute = () => {
    onChange?.("attributeRows", [...attributeRows, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    const nextRows = attributeRows.filter((_, rowIndex) => rowIndex !== index);
    onChange?.("attributeRows", nextRows.length ? nextRows : [{ key: "", value: "" }]);
  };

  const handleNameChange = (nextName) => {
    onChange?.("name", nextName);
    if (!values.slug) {
      onChange?.("slug", normalizeSlug(`${nextName}-${values.sku || ""}`));
    }
  };

  const handleSkuChange = (nextSku) => {
    onChange?.("sku", nextSku.toUpperCase());
    if (!values.slug) {
      onChange?.("slug", normalizeSlug(`${values.name || "variant"}-${nextSku}`));
    }
  };

  return (
    <form aria-busy={loading} className="space-y-5" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {imagePreview ? (
              <OptimizedImage
                alt={values.name || "Variant preview"}
                className="h-full w-full object-cover"
                fallbackKind="product"
                placeholderClassName="bg-slate-100"
                sizes="220px"
                src={imagePreview}
                wrapperClassName="aspect-[4/3] w-full bg-slate-100"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-sm font-black text-slate-400">
                Variant image
              </div>
            )}
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
            Ảnh chỉ là URL preview. Upload thật vẫn thuộc Media module.
          </p>
          <div className="mt-4 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Giá override</p>
            <p className="mt-1 text-lg font-black text-slate-950">{formatCurrency(values.price || 0)}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field error={errors.productId} id="productId" label="Sản phẩm" required>
            <select className={inputClass} disabled={loading} onChange={(event) => onChange?.("productId", event.target.value)} value={values.productId || ""}>
              <option value="">Chọn sản phẩm</option>
              {productOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field error={errors.status} id="status" label="Trạng thái" required>
            <select className={inputClass} disabled={loading} onChange={(event) => onChange?.("status", event.target.value)} value={values.status || "ACTIVE"}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field error={errors.sku} helper="Dùng để quản lý tồn kho và đối soát đơn hàng." id="sku" label="SKU" required>
            <input className={inputClass} disabled={loading} onChange={(event) => handleSkuChange(event.target.value)} placeholder="IP15PM-256-BLK" value={values.sku || ""} />
          </Field>

          <Field error={errors.slug} id="slug" label="Slug" required>
            <input className={inputClass} disabled={loading} onChange={(event) => onChange?.("slug", event.target.value)} placeholder="iphone-15-pro-max-256-black" value={values.slug || ""} />
          </Field>

          <Field error={errors.name} id="name" label="Tên biến thể" required>
            <input className={inputClass} disabled={loading} onChange={(event) => handleNameChange(event.target.value)} placeholder="256GB - Đen" value={values.name || ""} />
          </Field>

          <Field error={errors.color} id="color" label="Màu" required>
            <input className={inputClass} disabled={loading} onChange={(event) => onChange?.("color", event.target.value)} placeholder="Đen" value={values.color || ""} />
          </Field>

          <Field error={errors.price} id="price" label="Giá override" required>
            <input className={inputClass} disabled={loading} min="0" onChange={(event) => onChange?.("price", event.target.value)} type="number" value={values.price ?? 0} />
          </Field>

          <Field error={errors.stock} helper="Tổng tồn kho variant. Chi tiết theo kho xử lý ở Warehouse module." id="stock" label="Tồn kho" required>
            <input className={inputClass} disabled={loading} min="0" onChange={(event) => onChange?.("stock", event.target.value)} type="number" value={values.stock ?? 0} />
          </Field>

          <Field error={errors.size} helper="Ví dụ: S, M, 256GB, 16GB RAM." id="size" label="Size / cấu hình">
            <input className={inputClass} disabled={loading} onChange={(event) => onChange?.("size", event.target.value)} placeholder="256GB" value={values.size || ""} />
          </Field>

          <Field error={errors.thumbnailUrl} id="thumbnailUrl" label="Ảnh preview">
            <input className={inputClass} disabled={loading} onChange={(event) => onChange?.("thumbnailUrl", event.target.value)} placeholder="https://cdn.example.com/variant.jpg" value={values.thumbnailUrl || ""} />
          </Field>

          <div className="md:col-span-2">
            <Field error={errors.attributes} helper="Thêm thông số động như RAM, ROM, switch, form factor, kết nối." id="attributes" label="Attributes">
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {attributeRows.map((row, index) => (
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_36px]" key={`${index}-${row.key}`}>
                    <input className={inputClass} disabled={loading} onChange={(event) => updateAttribute(index, "key", event.target.value)} placeholder="RAM" value={row.key || ""} />
                    <input className={inputClass} disabled={loading} onChange={(event) => updateAttribute(index, "value", event.target.value)} placeholder="16GB" value={row.value || ""} />
                    <button
                      className="flex h-11 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={loading}
                      onClick={() => removeAttribute(index)}
                      title="Xóa attribute"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                  onClick={addAttribute}
                  type="button"
                >
                  <Plus size={15} />
                  Thêm attribute
                </button>
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field helper="Ghi chú nội bộ, không gửi API." id="note" label="Ghi chú">
              <textarea className={textareaClass} disabled placeholder="Variant API hiện lưu attributes trong specsJson." />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
          disabled={loading}
          onClick={onCancel}
          type="button"
        >
          Hủy
        </button>
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {mode === "edit" ? "Lưu thay đổi" : "Tạo biến thể"}
        </button>
      </div>
    </form>
  );
}

export default VariantForm;
