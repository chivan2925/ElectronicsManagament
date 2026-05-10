import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import FormFieldMessage from "../ui/form/FormFieldMessage";
import { cn } from "../../utils/classNames";
import { fadeUp, staggerContainer } from "../../styles/animations";
import { getFormFieldDescribedBy } from "../../utils/formValidation";

const MotionDiv = motion.div;

const defaultHighlights = [
  {
    icon: ShieldCheck,
    label: "Bảo mật tài khoản",
    value: "Bảo vệ thông tin đăng nhập và phiên mua sắm.",
  },
  {
    icon: PackageCheck,
    label: "Theo dõi đơn hàng",
    value: "Chuẩn bị cho lịch sử mua hàng và bảo hành.",
  },
  {
    icon: Truck,
    label: "Checkout nhanh hơn",
    value: "Sẵn sàng cho luồng giao hàng và ưu đãi cá nhân.",
  },
];

export function AuthField({
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
  placeholder,
  required = false,
  rightElement,
  type = "text",
  value,
}) {
  const Icon = icon;
  const hasError = Boolean(error);
  const hasHelper = Boolean(helper);
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
          "premium-transition flex h-12 items-center rounded-2xl border bg-slate-950/50 px-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl focus-within:bg-slate-950/75",
          disabled && "cursor-not-allowed opacity-70",
          hasError
            ? "border-red-300/70 shadow-[0_0_28px_rgba(239,68,68,0.16)]"
            : "border-white/10 focus-within:border-blue-300/80 focus-within:shadow-[0_0_30px_rgba(0,91,255,0.2)]",
        )}
      >
        {Icon && <Icon className={cn("mr-2 shrink-0", hasError ? "text-red-200" : "text-blue-200")} size={18} />}
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
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
        {rightElement && <div className="ml-2 flex shrink-0">{rightElement}</div>}
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

export function AuthCheckbox({ checked, children, disabled = false, error, id, onChange, required = false }) {
  const hasError = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div data-field-name={id}>
      <label
        className={cn(
          "group flex cursor-pointer items-start gap-3 text-sm font-semibold text-slate-300",
          disabled && "cursor-not-allowed opacity-65",
        )}
        htmlFor={id}
      >
        <span
          className={cn(
            "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border bg-slate-950/55 transition-default group-hover:border-blue-300/70 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-300/60 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-slate-950",
            hasError ? "border-red-300/70" : "border-white/15",
          )}
        >
          <input
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            aria-required={required}
            checked={checked}
            className="peer sr-only"
            disabled={disabled}
            id={id}
            name={id}
            onChange={(event) => onChange(event.target.checked)}
            required={required}
            type="checkbox"
          />
          <CheckCircle2 className="scale-75 text-blue-200 opacity-0 transition-default peer-checked:opacity-100" size={16} />
        </span>
        <span className="leading-relaxed">{children}</span>
      </label>
      <FormFieldMessage id={errorId} tone="error">
        {error}
      </FormFieldMessage>
    </div>
  );
}

export function AuthFormShell({ busy = false, children, feedback, footer, onSubmit, subtitle, title }) {
  const isSuccess = feedback?.tone === "success";
  const isError = feedback?.tone === "error";

  return (
    <motion.form
      animate="visible"
      aria-busy={busy}
      className="relative w-full min-w-0 overflow-hidden rounded-3xl border border-blue-300/20 bg-[#07111F]/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_44px_rgba(0,91,255,0.13)] backdrop-blur-2xl sm:p-6 lg:p-7"
      initial="hidden"
      noValidate
      onSubmit={onSubmit}
      variants={fadeUp}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/55 to-transparent" />
      <div className="mb-5">
        <h2 className="text-section break-words text-2xl">{title}</h2>
        <p className="text-muted mt-2 text-sm">{subtitle}</p>
      </div>

      {feedback?.message && (
        <div
          aria-live={isError ? "assertive" : "polite"}
          className={cn(
            "mb-4 rounded-2xl border p-3 text-sm font-bold",
            isSuccess
              ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
              : isError
                ? "border-red-300/30 bg-red-500/10 text-red-100"
                : "border-blue-300/30 bg-blue-500/10 text-blue-100",
          )}
          role={isError ? "alert" : "status"}
        >
          <div className="flex gap-2">
            {isSuccess ? (
              <CheckCircle2 className="mt-0.5 shrink-0" size={17} />
            ) : isError ? (
              <AlertCircle className="mt-0.5 shrink-0" size={17} />
            ) : (
              <Sparkles className="mt-0.5 shrink-0" size={17} />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4">{children}</div>

      {footer && <div className="mt-5">{footer}</div>}
    </motion.form>
  );
}

export function SocialAuthButtons({ disabled = false, onPlaceholder }) {
  const providers = [
    {
      icon: Mail,
      id: "google",
      label: "Google",
    },
    {
      icon: UserRound,
      id: "facebook",
      label: "Facebook",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-caption shrink-0 text-slate-500">Hoặc tiếp tục với</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {providers.map((provider) => {
          const Icon = provider.icon;

          return (
            <button
              className="premium-transition inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] text-sm font-black text-slate-200 outline-none hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_28px_rgba(0,91,255,0.18)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60"
              disabled={disabled}
              key={provider.id}
              onClick={() => onPlaceholder(provider.label)}
              type="button"
            >
              <Icon size={18} />
              {provider.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AuthLayout({
  badge,
  backLabel = "Về cửa hàng",
  backTo = "/",
  children,
  highlights = defaultHighlights,
  showStoreHeader = true,
  subtitle,
  switchLabel,
  switchText,
  switchTo,
  title,
}) {
  return (
    <>
      <main
        className={cn("page-container flex items-center justify-center py-8 sm:py-10", showStoreHeader ? "min-h-[calc(100vh-160px)]" : "min-h-screen")}
        id="main-content"
        tabIndex={-1}
      >
        <MotionDiv
          animate="visible"
          className="grid w-full max-w-6xl min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center"
          initial="hidden"
          variants={staggerContainer}
        >
          <MotionDiv className="order-2 min-w-0 lg:order-1" variants={fadeUp}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/36 p-5 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-6 lg:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(0,91,255,0.22),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_34%,rgba(0,91,255,0.08))]" />
              <div className="relative z-10">
                <Link className="premium-transition mb-5 inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-white" to={backTo}>
                  <ArrowLeft size={16} />
                  {backLabel}
                </Link>

                <Badge className="mb-4 gap-2" variant="primary">
                  <LockKeyhole size={13} />
                  {badge}
                </Badge>
                <h1 className="text-heading max-w-2xl break-words">{title}</h1>
                <p className="text-muted mt-3 max-w-xl text-base">{subtitle}</p>

                <div className="mt-7 grid gap-3">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="store-stat-card rounded-2xl p-3" key={item.label}>
                        <Icon className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" size={20} />
                        <p className="text-sm font-black text-white">{item.label}</p>
                        <p className="text-caption mt-1 text-slate-400">{item.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-blue-300/20 bg-blue-500/[0.07] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-100 ring-1 ring-blue-300/30">
                      <Zap size={22} fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-black text-white">Tài khoản ElectroStore</p>
                      <p className="text-caption mt-1 text-slate-400">Quản lý mua sắm, bảo hành và ưu đãi trong một tài khoản.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv className="order-1 min-w-0 lg:order-2" variants={fadeUp}>
            {children}
            <p className="mt-4 text-center text-sm font-semibold text-slate-400">
              {switchText}{" "}
              <Link className="font-black text-blue-200 transition-default hover:text-white" to={switchTo}>
                {switchLabel}
              </Link>
            </p>
          </MotionDiv>
        </MotionDiv>
      </main>
    </>
  );
}

export default AuthLayout;
