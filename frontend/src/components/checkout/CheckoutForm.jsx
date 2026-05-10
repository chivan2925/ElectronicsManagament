import {
  AlertCircle,
  Building2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";
import { cn } from "../../utils/classNames";

function CheckoutField({
  autoComplete,
  error,
  icon,
  id,
  inputMode,
  label,
  onBlur,
  onChange,
  placeholder,
  required = false,
  textarea = false,
  type = "text",
  value,
}) {
  const hasError = Boolean(error);
  const Icon = icon;
  const errorId = `${id}-error`;

  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-200" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-red-300">*</span>}
      </label>

      <div
        className={cn(
          "premium-transition flex rounded-2xl border bg-slate-950/45 px-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl focus-within:bg-slate-950/70",
          textarea ? "items-start py-3" : "h-12 items-center",
          hasError
            ? "border-red-300/70 shadow-[0_0_28px_rgba(239,68,68,0.16)]"
            : "border-white/10 focus-within:border-blue-300/80 focus-within:shadow-[0_0_30px_rgba(0,91,255,0.2)]",
        )}
      >
        {Icon && <Icon className={cn("mr-2 shrink-0", hasError ? "text-red-200" : "text-blue-200")} size={18} />}
        {textarea ? (
          <textarea
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            aria-required={required}
            autoComplete={autoComplete}
            className="min-h-24 min-w-0 flex-1 resize-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
            id={id}
            name={id}
            onBlur={() => onBlur(id)}
            onChange={(event) => onChange(id, event.target.value)}
            placeholder={placeholder}
            required={required}
            value={value}
          />
        ) : (
          <input
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            aria-required={required}
            autoComplete={autoComplete}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
            id={id}
            inputMode={inputMode}
            name={id}
            onBlur={() => onBlur(id)}
            onChange={(event) => onChange(id, event.target.value)}
            placeholder={placeholder}
            required={required}
            type={type}
            value={value}
          />
        )}
      </div>

      {hasError && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-200" id={errorId}>
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

function CheckoutSection({ children, eyebrow, title }) {
  return (
    <section className="store-surface-panel rounded-3xl p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-caption text-blue-200">{eyebrow}</p>
        <h2 className="text-section mt-1 text-xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CheckoutForm({ errors, onBlur, onChange, values }) {
  return (
    <div className="grid gap-4">
      <CheckoutSection eyebrow="Thông tin liên hệ" title="Thông tin khách hàng">
        <div className="grid gap-4 md:grid-cols-2">
          <CheckoutField
            autoComplete="name"
            error={errors.fullName}
            icon={UserRound}
            id="fullName"
            label="Họ và tên"
            onBlur={onBlur}
            onChange={onChange}
            placeholder="Nguyễn Văn A"
            required
            value={values.fullName}
          />
          <CheckoutField
            autoComplete="tel"
            error={errors.phone}
            icon={Phone}
            id="phone"
            inputMode="tel"
            label="Số điện thoại"
            onBlur={onBlur}
            onChange={onChange}
            placeholder="0901234567"
            required
            value={values.phone}
          />
          <div className="md:col-span-2">
            <CheckoutField
              autoComplete="email"
              error={errors.email}
              icon={Mail}
              id="email"
              inputMode="email"
              label="Email nhận xác nhận"
              onBlur={onBlur}
              onChange={onChange}
              placeholder="you@example.com"
              required
              type="email"
              value={values.email}
            />
          </div>
        </div>
      </CheckoutSection>

      <CheckoutSection eyebrow="Khu vực nhận hàng" title="Địa chỉ giao hàng">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <CheckoutField
              autoComplete="street-address"
              error={errors.address}
              icon={MapPin}
              id="address"
              label="Địa chỉ chi tiết"
              onBlur={onBlur}
              onChange={onChange}
              placeholder="Số nhà, tên đường, khu vực"
              required
              value={values.address}
            />
          </div>
          <CheckoutField
            autoComplete="address-level1"
            error={errors.city}
            icon={Building2}
            id="city"
            label="Tỉnh / Thành phố"
            onBlur={onBlur}
            onChange={onChange}
            placeholder="TP. Hồ Chí Minh"
            required
            value={values.city}
          />
          <CheckoutField
            autoComplete="address-level2"
            error={errors.district}
            icon={Building2}
            id="district"
            label="Quận / Huyện"
            onBlur={onBlur}
            onChange={onChange}
            placeholder="Quận 1"
            required
            value={values.district}
          />
          <CheckoutField
            autoComplete="address-level3"
            error={errors.ward}
            icon={MapPin}
            id="ward"
            label="Phường / Xã"
            onBlur={onBlur}
            onChange={onChange}
            placeholder="Phường Bến Nghé"
            required
            value={values.ward}
          />
          <div className="md:col-span-2">
            <CheckoutField
              error={errors.note}
              icon={MessageSquare}
              id="note"
              label="Ghi chú giao hàng"
              onBlur={onBlur}
              onChange={onChange}
              placeholder="Ví dụ: gọi trước khi giao, giao giờ hành chính..."
              textarea
              value={values.note}
            />
          </div>
        </div>
      </CheckoutSection>
    </div>
  );
}

export default CheckoutForm;
