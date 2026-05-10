import { createElement } from "react";
import { Loader2, Mail, MapPin, PackageCheck, Phone, Save, Truck, UserRound } from "lucide-react";
import { StatusBadge } from "../../../admin/components";
import LoadingState from "../../../components/ui/feedback/LoadingState";
import OrderTimeline from "./OrderTimeline";
import { ORDER_STAGE_OPTIONS, PAYMENT_STATUS_OPTIONS, SHIPPING_PROVIDER_OPTIONS, SHIPPING_STATUS_OPTIONS } from "./orderOptions";
import { formatCurrency } from "../../../utils/formatters";

const statusTone = {
  CANCELLED: "rose",
  COMPLETED: "emerald",
  FAILED: "rose",
  PAID: "emerald",
  PENDING: "amber",
  PROCESSING: "blue",
  REFUNDED: "violet",
  RETURNED: "violet",
  SHIPPING: "blue",
};

function formatAddress(address = {}) {
  return [address.line, address.ward, address.district, address.province].filter(Boolean).join(", ");
}

function InfoCard({ children, icon, title }) {
  return (
    <section className="admin-panel rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
          {createElement(icon, { size: 17 })}
        </span>
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({ children, label }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-black uppercase tracking-normal text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function SelectField({ disabled, label, onChange, options, value }) {
  return (
    <Field label={label}>
      <select
        className="admin-control h-11 w-full rounded-xl px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function OrderDetail({
  canUpdate = false,
  formValues = {},
  loading = false,
  onChange,
  onSubmit,
  order,
  submitting = false,
}) {
  if (loading && !order) {
    return (
      <LoadingState
        className="min-h-80"
        message="Đang lấy thông tin khách hàng, thanh toán và vận chuyển."
        surface="admin"
        title="Đang tải chi tiết đơn hàng"
        variant="panel"
      />
    );
  }

  if (!order) {
    return null;
  }

  const address = formatAddress(order.shippingAddress);
  const orderItems = order.items ?? [];
  const isUpdateDisabled = !canUpdate || submitting || loading;

  return (
    <div className="space-y-4">
      <section className="admin-panel rounded-2xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Đơn hàng</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{order.code || `#${order.id}`}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge
                label={order.stageLabel}
                status={String(order.stage || "").toUpperCase()}
                tone={order.stage === "cancelled" ? "rose" : order.stage === "delivered" ? "emerald" : "blue"}
              />
              <StatusBadge label={`Thanh toán ${order.paymentStatus}`} status={order.paymentStatus} tone={statusTone[order.paymentStatus]} />
              <StatusBadge label={`Vận chuyển ${order.shippingStatus}`} status={order.shippingStatus} tone={statusTone[order.shippingStatus]} />
            </div>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-right">
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Tổng tiền</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{formatCurrency(order.total || 0)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <InfoCard icon={UserRound} title="Thông tin khách hàng">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-slate-500">Khách hàng</p>
                <p className="mt-1 font-black text-slate-950">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-slate-500">Mã người dùng</p>
                <p className="mt-1 font-bold text-slate-700">{order.userId || "—"}</p>
              </div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Mail size={15} />
                {order.userEmail || "—"}
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Phone size={15} />
                {order.userPhoneNumber || order.shippingPhone || "—"}
              </p>
            </div>
          </InfoCard>

          <InfoCard icon={MapPin} title="Địa chỉ giao hàng">
            <div className="space-y-2 text-sm font-semibold leading-6 text-slate-600">
              <p className="font-black text-slate-950">{order.shippingName || order.customerName}</p>
              <p>{order.shippingPhone || "—"}</p>
              <p>{address || "—"}</p>
            </div>
          </InfoCard>

          <InfoCard icon={PackageCheck} title="Sản phẩm trong đơn">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-normal text-slate-500">Sản phẩm</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-normal text-slate-500">SL</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-normal text-slate-500">Giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {orderItems.map((item) => (
                    <tr key={`${item.variantId}-${item.variantName}`}>
                      <td className="px-4 py-3">
                        <p className="font-black text-slate-900">{item.productName}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{item.variantName}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-black text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm font-black text-slate-950">{formatCurrency(item.lineTotal)}</td>
                    </tr>
                  ))}
                  {orderItems.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-sm font-semibold text-slate-500" colSpan={3}>
                        {loading ? "Đang tải sản phẩm..." : "Chưa có sản phẩm trong đơn hàng."}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </InfoCard>
        </div>

        <aside className="space-y-4">
          <section className="admin-panel rounded-2xl p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Truck size={17} />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-950">Cập nhật vận hành</h3>
                <p className="text-xs font-semibold text-slate-500">Thay đổi trạng thái tuân theo quy tắc chuyển đổi backend.</p>
              </div>
            </div>

            <div className="grid gap-3">
              <SelectField
                disabled={isUpdateDisabled}
                label="Trạng thái đơn"
                onChange={(value) => onChange?.("stage", value)}
                options={ORDER_STAGE_OPTIONS}
                value={formValues.stage}
              />
              <SelectField
                disabled={isUpdateDisabled}
                label="Trạng thái thanh toán"
                onChange={(value) => onChange?.("paymentStatus", value)}
                options={PAYMENT_STATUS_OPTIONS}
                value={formValues.paymentStatus}
              />
              <SelectField
                disabled={isUpdateDisabled}
                label="Trạng thái vận chuyển"
                onChange={(value) => onChange?.("shippingStatus", value)}
                options={SHIPPING_STATUS_OPTIONS}
                value={formValues.shippingStatus}
              />
              <SelectField
                disabled={isUpdateDisabled}
                label="Đơn vị vận chuyển"
                onChange={(value) => onChange?.("shippingProvider", value)}
                options={SHIPPING_PROVIDER_OPTIONS}
                value={formValues.shippingProvider}
              />
              <Field label="Mã vận đơn">
                <input
                  className="admin-control h-11 w-full rounded-xl px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  disabled={isUpdateDisabled}
                  maxLength={20}
                  onChange={(event) => onChange?.("trackingCode", event.target.value)}
                  placeholder="VD: GHN123456789"
                  value={formValues.trackingCode || ""}
                />
              </Field>
            </div>

            <button
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white shadow-admin-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isUpdateDisabled}
              onClick={onSubmit}
              type="button"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Lưu thay đổi
            </button>
          </section>

          <section className="admin-panel rounded-2xl p-4">
            <h3 className="text-sm font-black text-slate-950">Tóm tắt thanh toán</h3>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
              <div className="flex justify-between gap-4">
                <span>Tạm tính</span>
                <span className="font-black text-slate-900">{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Giảm giá {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span className="font-black text-emerald-600">-{formatCurrency(order.discount || 0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Phí vận chuyển</span>
                <span className="font-black text-slate-900">{formatCurrency(order.shippingFee || 0)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <div className="flex justify-between gap-4">
                  <span className="font-black text-slate-950">Tổng tiền</span>
                  <span className="font-black text-slate-950">{formatCurrency(order.total || 0)}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <OrderTimeline order={order} />
    </div>
  );
}

export default OrderDetail;
