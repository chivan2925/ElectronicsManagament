import { createElement } from "react";
import { cn } from "../../utils/classNames";

const variantClasses = {
  store: "store-glass-soft rounded-2xl",
  glass: "store-glass rounded-2xl",
  product:
    "premium-transition group relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.12),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(7,17,31,0.96))] p-4 shadow-xl shadow-black/20 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(130deg,rgba(255,255,255,0.08),transparent_28%,transparent_70%,rgba(0,91,255,0.1))] before:opacity-0 before:transition-opacity before:duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-[0_0_36px_rgba(0,91,255,0.24),0_24px_70px_rgba(0,0,0,0.35)] hover:before:opacity-100",
  flash:
    "premium-transition rounded-2xl border border-blue-400/30 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.32),transparent_42%),linear-gradient(150deg,rgba(0,91,255,0.24),#07111F_42%,#050B14_100%)] p-5 shadow-[0_0_42px_rgba(0,91,255,0.2),0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:border-blue-300/60 hover:shadow-[0_0_56px_rgba(0,91,255,0.28),0_28px_80px_rgba(0,0,0,0.38)]",
  admin: "rounded-lg border border-border bg-panel shadow-sm",
};

function Card({ as: Component = "div", children, className, variant = "store", ...props }) {
  return createElement(
    Component,
    {
      className: cn(variantClasses[variant] || variantClasses.store, className),
      ...props,
    },
    children,
  );
}

export default Card;
