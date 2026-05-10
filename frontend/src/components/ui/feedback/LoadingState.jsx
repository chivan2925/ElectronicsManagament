import { createElement } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../../utils/classNames";
import SkeletonBlock from "../../skeletons/SkeletonBlock";

const surfaceClasses = {
  admin: {
    body: "text-slate-500",
    container: "border-slate-200 bg-white text-slate-950 shadow-admin-card",
    icon: "border-blue-100 bg-blue-50 text-primary",
    page: "bg-[#F5F7FB] text-slate-950",
    skeleton: "bg-slate-100",
    title: "text-slate-950",
  },
  store: {
    body: "text-slate-300",
    container:
      "border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.18),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.78),rgba(7,17,31,0.94))] text-white shadow-[0_22px_70px_rgba(0,0,0,0.24)]",
    icon: "border-blue-200/20 bg-blue-500/[0.14] text-blue-100 shadow-[0_0_28px_rgba(0,91,255,0.2)]",
    page: "bg-[#050B14] text-white",
    skeleton: "",
    title: "text-white",
  },
};

const variantClasses = {
  inline: "rounded-2xl p-3 sm:p-4",
  page: "rounded-2xl p-4 sm:p-5",
  panel: "rounded-3xl p-5 sm:p-6",
};

function LoadingSkeletonRows({ rows = 3, surface = "store" }) {
  const palette = surfaceClasses[surface] ?? surfaceClasses.store;

  return (
    <div className="mt-5 grid gap-2.5" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => {
        const widthClassName = index % 3 === 0 ? "w-4/5" : index % 3 === 1 ? "w-full" : "w-2/3";

        if (surface === "admin") {
          return (
            <span
              className={cn("block h-3.5 animate-pulse rounded-full", palette.skeleton, widthClassName)}
              key={`loading-row-${index}`}
            />
          );
        }

        return <SkeletonBlock className={cn("h-3.5 rounded-full", widthClassName)} key={`loading-row-${index}`} />;
      })}
    </div>
  );
}

function LoadingState({
  className,
  icon: Icon = Loader2,
  message = "Dữ liệu đang được chuẩn bị, vui lòng chờ trong giây lát.",
  showSkeleton = false,
  skeletonRows = 3,
  surface = "store",
  title = "Đang tải dữ liệu",
  variant = "panel",
}) {
  const palette = surfaceClasses[surface] ?? surfaceClasses.store;
  const isPage = variant === "page";
  const isInline = variant === "inline";
  const content = (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "relative overflow-hidden border",
        palette.container,
        variantClasses[variant] || variantClasses.panel,
        isInline ? "flex items-start gap-3" : "text-center",
        className,
      )}
      role="status"
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center border",
          palette.icon,
          isInline ? "h-10 w-10 rounded-2xl" : "mx-auto h-14 w-14 rounded-2xl",
        )}
      >
        {createElement(Icon, { className: "animate-spin", size: isInline ? 18 : 24 })}
      </div>

      <div className={cn("min-w-0", isInline ? "text-left" : "mt-4")}>
        <p className={cn("font-black", palette.title, isInline ? "text-sm" : "text-base")}>{title}</p>
        {message ? (
          <p className={cn("mt-1 text-sm leading-6", palette.body)}>
            {message}
          </p>
        ) : null}
        {showSkeleton ? <LoadingSkeletonRows rows={skeletonRows} surface={surface} /> : null}
      </div>
    </div>
  );

  if (!isPage) {
    return content;
  }

  return (
    <div className={cn("flex items-center justify-center px-4", surface === "admin" ? "min-h-screen" : "min-h-[70vh]", palette.page)}>
      {content}
    </div>
  );
}

export default LoadingState;
