import { createElement } from "react";
import { Loader2, Mail, MapPin, PackageCheck, Phone, Save, Truck, UserRound } from "lucide-react";
import OrderTimeline from "./OrderTimeline";
import { ORDER_STAGE_OPTIONS, PAYMENT_STATUS_OPTIONS, SHIPPING_PROVIDER_OPTIONS, SHIPPING_STATUS_OPTIONS } from "./orderOptions";
import { cn } from "../../../utils/classNames";
import { formatCurrency } from "../../../utils/formatters";

const toneClasses = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

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

function Badge({ label, tone = "slate" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1", toneClasses[tone] || toneClasses.slate)}>
      {label}
    </span>
  );
}

function formatAddress(address = {}) {
  return [address.line, address.ward, address.district, address.province].filter(Boolean).join(", ");
}

function InfoCard({ children, icon, title }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading order detail...
      </div>
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
      <section className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Order</p>
            <h2 className="mt-1 text-2xl font-black text-white">{order.code || `#${order.id}`}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge label={order.stageLabel} tone={order.stage === "cancelled" ? "rose" : order.stage === "delivered" ? "emerald" : "blue"} />
              <Badge label={`Payment ${order.paymentStatus}`} tone={statusTone[order.paymentStatus]} />
              <Badge label={`Shipping ${order.shippingStatus}`} tone={statusTone[order.shippingStatus]} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-right">
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-black text-white">{formatCurrency(order.total || 0)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <InfoCard icon={UserRound} title="Customer info">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-slate-500">Customer</p>
                <p className="mt-1 font-black text-slate-950">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-slate-500">User ID</p>
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

          <InfoCard icon={MapPin} title="Shipping address">
            <div className="space-y-2 text-sm font-semibold leading-6 text-slate-600">
              <p className="font-black text-slate-950">{order.shippingName || order.customerName}</p>
              <p>{order.shippingPhone || "—"}</p>
              <p>{address || "—"}</p>
            </div>
          </InfoCard>

          <InfoCard icon={PackageCheck} title="Order items">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-normal text-slate-500">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-normal text-slate-500">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-normal text-slate-500">Price</th>
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
                        {loading ? "Loading items..." : "No order items found."}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </InfoCard>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Truck size={17} />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-950">Update workflow</h3>
                <p className="text-xs font-semibold text-slate-500">State changes follow backend transition rules.</p>
              </div>
            </div>

            <div className="grid gap-3">
              <SelectField
                disabled={isUpdateDisabled}
                label="Order status"
                onChange={(value) => onChange?.("stage", value)}
                options={ORDER_STAGE_OPTIONS}
                value={formValues.stage}
              />
              <SelectField
                disabled={isUpdateDisabled}
                label="Payment status"
                onChange={(value) => onChange?.("paymentStatus", value)}
                options={PAYMENT_STATUS_OPTIONS}
                value={formValues.paymentStatus}
              />
              <SelectField
                disabled={isUpdateDisabled}
                label="Shipping status"
                onChange={(value) => onChange?.("shippingStatus", value)}
                options={SHIPPING_STATUS_OPTIONS}
                value={formValues.shippingStatus}
              />
              <SelectField
                disabled={isUpdateDisabled}
                label="Carrier"
                onChange={(value) => onChange?.("shippingProvider", value)}
                options={SHIPPING_PROVIDER_OPTIONS}
                value={formValues.shippingProvider}
              />
              <Field label="Tracking code">
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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
              Save changes
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-950">Payment summary</h3>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span className="font-black text-slate-900">{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span className="font-black text-emerald-600">-{formatCurrency(order.discount || 0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span className="font-black text-slate-900">{formatCurrency(order.shippingFee || 0)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <div className="flex justify-between gap-4">
                  <span className="font-black text-slate-950">Total</span>
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
