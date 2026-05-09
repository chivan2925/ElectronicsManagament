import { createElement } from "react";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/classNames";

const MotionDiv = motion.div;

const surfaceClasses = {
  admin: {
    action:
      "bg-primary text-white shadow-admin-card hover:bg-primary-hover focus-visible:ring-blue-200 focus-visible:ring-offset-white",
    body: "text-slate-500",
    container: "border-border bg-white text-ink shadow-admin-card",
    icon: "border-blue-100 bg-blue-50 text-primary",
    secondary:
      "border border-border bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 focus-visible:ring-blue-100 focus-visible:ring-offset-white",
    shell: "bg-slate-50",
    title: "text-ink",
  },
  store: {
    action:
      "bg-primary text-white shadow-[0_0_28px_rgba(0,91,255,0.34)] hover:bg-primary-hover focus-visible:ring-blue-300/60 focus-visible:ring-offset-slate-950",
    body: "text-slate-300",
    container:
      "border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.2),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.84),rgba(7,17,31,0.96))] text-white shadow-[0_22px_70px_rgba(0,0,0,0.28)]",
    icon: "border-blue-200/20 bg-blue-500/12 text-blue-100 shadow-[0_0_32px_rgba(0,91,255,0.24)]",
    secondary:
      "border border-white/10 bg-white/[0.04] text-slate-100 hover:border-blue-300/50 hover:bg-blue-500/10 focus-visible:ring-blue-300/60 focus-visible:ring-offset-slate-950",
    shell: "bg-[#050B14]",
    title: "text-white",
  },
};

const sizeClasses = {
  compact: {
    container: "rounded-2xl p-5",
    icon: "h-12 w-12 rounded-xl",
    title: "text-base",
  },
  md: {
    container: "rounded-3xl p-6 sm:p-8",
    icon: "h-16 w-16 rounded-2xl",
    title: "text-2xl",
  },
};

function StateAction({ children, className, onClick, to }) {
  const sharedClassName = cn(
    "transition-default inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    className,
  );

  if (to) {
    return (
      <Link className={sharedClassName} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function EmptyState({
  actionIcon: ActionIcon,
  actionLabel,
  actionTo,
  children,
  className,
  description,
  eyebrow,
  framed = true,
  icon: Icon = PackageSearch,
  message,
  onAction,
  onSecondaryAction,
  secondaryActionLabel,
  secondaryActionTo,
  size = "md",
  surface = "store",
  title = "Không có dữ liệu",
}) {
  const palette = surfaceClasses[surface] ?? surfaceClasses.store;
  const sizing = sizeClasses[size] ?? sizeClasses.md;
  const body = message ?? description;

  return (
    <MotionDiv
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative isolate overflow-hidden text-center",
        framed ? cn("border", palette.container, sizing.container) : "p-2",
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {framed && surface === "store" && (
        <>
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-8 h-28 w-28 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        </>
      )}

      <div className={cn("relative z-10 mx-auto flex items-center justify-center border", palette.icon, sizing.icon)}>
        {createElement(Icon, { size: size === "compact" ? 24 : 34 })}
      </div>

      {eyebrow && (
        <p
          className={cn(
            "relative z-10 mx-auto mt-5 w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-normal",
            surface === "admin"
              ? "bg-blue-50 text-primary ring-1 ring-blue-100"
              : "bg-blue-500/15 text-blue-100 ring-1 ring-blue-200/20",
          )}
        >
          {eyebrow}
        </p>
      )}

      <h3 className={cn("relative z-10 mt-4 font-black tracking-normal", palette.title, sizing.title)}>{title}</h3>
      {body && <p className={cn("relative z-10 mx-auto mt-2 max-w-md text-sm leading-6", palette.body)}>{body}</p>}

      {children && <div className="relative z-10 mt-5">{children}</div>}

      {(actionLabel || secondaryActionLabel) && (
        <div className="relative z-10 mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {actionLabel && (
            <StateAction className={palette.action} onClick={onAction} to={actionTo}>
              {ActionIcon && createElement(ActionIcon, { size: 16 })}
              {actionLabel}
            </StateAction>
          )}
          {secondaryActionLabel && (
            <StateAction className={palette.secondary} onClick={onSecondaryAction} to={secondaryActionTo}>
              {secondaryActionLabel}
            </StateAction>
          )}
        </div>
      )}
    </MotionDiv>
  );
}

export default EmptyState;
