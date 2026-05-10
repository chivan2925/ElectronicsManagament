import { CalendarClock, Percent, TicketPercent } from "lucide-react";
import { useMemo } from "react";
import { COUPON_STATUS, COUPON_TYPE } from "../../../api/couponMapper";
import { AdminForm } from "../../../admin/components";
import { formatCurrency } from "../../../utils/formatters";

const COUPON_TYPE_OPTIONS = [
  { label: "Phần trăm đơn hàng", value: COUPON_TYPE.percent },
  { label: "Số tiền cố định", value: COUPON_TYPE.fixed },
];

const COUPON_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: COUPON_STATUS.active },
  { label: "Tạm ẩn", value: COUPON_STATUS.inactive },
];

function formatDiscountPreview(values = {}) {
  const value = Number(values.value || 0);

  if (values.type === COUPON_TYPE.percent) {
    const cap = Number(values.maxDiscount || 0);
    return cap > 0 ? `${value}% tối đa ${formatCurrency(cap)}` : `${value}%`;
  }

  return formatCurrency(value);
}

function CouponPreview({ values = {} }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-black text-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
          <TicketPercent size={17} />
        </span>
        Coupon preview
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-normal text-slate-400">Code</p>
        <p className="mt-1 break-all text-2xl font-black text-primary">{values.code || "COUPON"}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-slate-400">Discount</p>
            <p className="mt-1 text-sm font-black text-slate-900">{formatDiscountPreview(values)}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-slate-400">Min order</p>
            <p className="mt-1 text-sm font-black text-slate-900">{formatCurrency(Number(values.minOrder || 0))}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs font-semibold text-slate-500">
        <p className="flex items-center gap-2">
          <CalendarClock size={14} />
          {values.startDate || "Start date"} - {values.endDate || "End date"}
        </p>
        <p className="flex items-center gap-2">
          <Percent size={14} />
          {values.usageLimit ? `${values.usageLimit} lượt dùng tối đa` : "Không giới hạn lượt dùng"}
        </p>
      </div>
    </aside>
  );
}

function CouponForm({
  errors = {},
  loading = false,
  mode = "create",
  onCancel,
  onChange,
  onSubmit,
  values = {},
}) {
  const fields = useMemo(
    () => [
      {
        helper: "Tối đa 20 ký tự. Nên dùng chữ in hoa, số, dấu gạch ngang hoặc gạch dưới.",
        label: "Mã coupon",
        name: "code",
        placeholder: "SUMMER2026",
        required: true,
      },
      {
        label: "Loại giảm giá",
        name: "type",
        options: COUPON_TYPE_OPTIONS,
        required: true,
        type: "select",
      },
      {
        helper: values.type === COUPON_TYPE.percent ? "Nhập phần trăm từ 1 đến 100." : "Nhập số tiền giảm trực tiếp.",
        label: values.type === COUPON_TYPE.percent ? "Giá trị (%)" : "Giá trị (VND)",
        min: 1,
        name: "value",
        placeholder: values.type === COUPON_TYPE.percent ? "10" : "500000",
        required: true,
        step: values.type === COUPON_TYPE.percent ? "0.1" : "1000",
        type: "number",
      },
      {
        helper: "Để 0 nếu coupon áp dụng cho mọi đơn hàng.",
        label: "Đơn tối thiểu",
        min: 0,
        name: "minOrder",
        placeholder: "0",
        required: true,
        step: "1000",
        type: "number",
      },
      {
        helper: "Date picker dùng giờ local, backend nhận LocalDateTime.",
        label: "Ngày bắt đầu",
        name: "startDate",
        required: true,
        type: "datetime-local",
      },
      {
        label: "Ngày kết thúc",
        name: "endDate",
        required: true,
        type: "datetime-local",
      },
      {
        helper: "Để trống nếu không giới hạn lượt dùng.",
        label: "Giới hạn lượt dùng",
        min: 1,
        name: "usageLimit",
        placeholder: "100",
        step: "1",
        type: "number",
      },
      {
        disabled: values.type !== COUPON_TYPE.percent,
        helper:
          values.type === COUPON_TYPE.percent
            ? "Đặt giới hạn tiền giảm tối đa cho coupon phần trăm."
            : "Không áp dụng với coupon giảm tiền cố định.",
        label: "Giảm tối đa",
        min: 0,
        name: "maxDiscount",
        placeholder: "300000",
        step: "1000",
        type: "number",
      },
      {
        label: "Trạng thái",
        name: "status",
        options: COUPON_STATUS_OPTIONS,
        required: true,
        type: "select",
      },
    ],
    [values.type],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <CouponPreview values={values} />
      <AdminForm
        errors={errors}
        fields={fields}
        loading={loading}
        onCancel={onCancel}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel={mode === "edit" ? "Lưu coupon" : "Tạo coupon"}
        values={values}
      />
    </div>
  );
}

export default CouponForm;
