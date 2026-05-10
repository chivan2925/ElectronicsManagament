import {
  Building2,
  ChevronDown,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";
import { cn } from "../../utils/classNames";
import FormFieldMessage from "../ui/form/FormFieldMessage";
import { getFormFieldDescribedBy } from "../../utils/formValidation";

function CheckoutField({
  autoComplete,
  disabled = false,
  error,
  helper,
  icon,
  id,
  inputMode,
  label,
  onBlur,
  onChange,
  options,
  placeholder,
  required = false,
  textarea = false,
  type = "text",
  value,
  isLoading = false,
}) {
  const hasError = Boolean(error);
  const hasHelper = Boolean(helper);
  const Icon = icon;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = getFormFieldDescribedBy({ errorId, hasError, hasHelper, helperId });

  return (
    <div data-field-name={id}>
      <label className="mb-2 block text-sm font-black text-slate-200" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-red-300">*</span>}
      </label>

      <div
        className={cn(
          "premium-transition group flex rounded-2xl border bg-slate-950/45 px-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl focus-within:bg-slate-950/70",
          textarea ? "items-start py-3" : "h-12 items-center",
          disabled && "cursor-not-allowed opacity-70",
          hasError
            ? "border-red-300/70 shadow-[0_0_28px_rgba(239,68,68,0.16)]"
            : "border-white/10 focus-within:border-blue-300/80 focus-within:shadow-[0_0_30px_rgba(0,91,255,0.2)]",
        )}
      >
        {Icon && <Icon className={cn("mr-2 shrink-0", hasError ? "text-red-200" : "text-blue-200")} size={18} />}
        {textarea ? (
          <textarea
            aria-describedby={describedBy}
            aria-invalid={hasError}
            aria-required={required}
            autoComplete={autoComplete}
            className="min-h-24 min-w-0 flex-1 resize-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
            disabled={disabled}
            id={id}
            name={id}
            onBlur={() => onBlur(id)}
            onChange={(event) => onChange(id, event.target.value)}
            placeholder={placeholder}
            required={required}
            value={value}
          />
        ) : options ? (
          <div className="relative flex min-w-0 flex-1 items-center">
            <select
              aria-describedby={describedBy}
              aria-invalid={hasError}
              aria-required={required}
              autoComplete={autoComplete}
              className="min-w-0 flex-1 appearance-none bg-transparent py-2 pr-8 text-sm font-semibold text-white outline-none disabled:cursor-not-allowed [&>option]:bg-[#07111F] [&>option]:text-white"
              disabled={disabled || isLoading}
              id={id}
              name={id}
              onBlur={() => onBlur(id)}
              onChange={(event) => onChange(id, event.target.value)}
              required={required}
              value={value}
            >
              <option value="">{isLoading ? "Đang tải dữ liệu..." : placeholder}</option>
              {options.map((opt) => (
                <option key={opt.code || opt.id} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 text-slate-500 transition-colors group-focus-within:text-blue-300"
              size={16}
            />
          </div>
        ) : (
          <input
            aria-describedby={describedBy}
            aria-invalid={hasError}
            aria-required={required}
            autoComplete={autoComplete}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
            disabled={disabled}
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

      <FormFieldMessage id={errorId} tone="error">
        {error}
      </FormFieldMessage>
      {!hasError && (
        <FormFieldMessage id={helperId} tone="helper">
          {helper}
        </FormFieldMessage>
      )}
    </div>
  );
}

function CheckoutSection({ children, eyebrow, title }) {
  return (
    <section className="store-premium-sheen store-surface-panel rounded-3xl p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-caption text-blue-200">{eyebrow}</p>
        <h2 className="text-section mt-1 text-xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CheckoutForm({
  disabled = false,
  errors,
  onBlur,
  onChange,
  values,
  provinces = [],
  districts = [],
  wards = [],
  loading = {},
}) {
  return (
    <div className="grid gap-4">
      <CheckoutSection eyebrow="Thông tin liên hệ" title="Thông tin khách hàng">
        <div className="grid gap-4 md:grid-cols-2">
          <CheckoutField
            autoComplete="name"
            disabled={disabled}
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
            disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
            disabled={disabled}
            error={errors.city}
            icon={Building2}
            id="city"
            isLoading={loading.provinces}
            label="Tỉnh / Thành phố"
            onBlur={onBlur}
            onChange={onChange}
            options={provinces}
            placeholder="Chọn Tỉnh / Thành phố"
            required
            value={values.city}
          />
          <CheckoutField
            autoComplete="address-level2"
            disabled={disabled || !values.city}
            error={errors.district}
            icon={Building2}
            id="district"
            isLoading={loading.districts}
            label="Quận / Huyện"
            onBlur={onBlur}
            onChange={onChange}
            options={districts}
            placeholder={values.city ? "Chọn Quận / Huyện" : "Vui lòng chọn Tỉnh/TP trước"}
            required
            value={values.district}
          />
          <CheckoutField
            autoComplete="address-level3"
            disabled={disabled || !values.district}
            error={errors.ward}
            icon={MapPin}
            id="ward"
            isLoading={loading.wards}
            label="Phường / Xã"
            onBlur={onBlur}
            onChange={onChange}
            options={wards}
            placeholder={values.district ? "Chọn Phường / Xã" : "Vui lòng chọn Quận/Huyện trước"}
            required
            value={values.ward}
          />
          <div className="md:col-span-2">
            <CheckoutField
              error={errors.note}
              disabled={disabled}
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
