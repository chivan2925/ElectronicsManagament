import { CheckCircle2, Circle, Clock, PackageCheck, Truck, XCircle } from "lucide-react";
import { ORDER_STAGE } from "../../../api/orderMapper";
import { cn } from "../../../utils/classNames";

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStepState(step, order = {}) {
  if (order.stage === ORDER_STAGE.cancelled) {
    return step.key === ORDER_STAGE.cancelled ? "active" : "muted";
  }

  const orderIndex = step.order;
  const activeIndex = {
    [ORDER_STAGE.pending]: 0,
    [ORDER_STAGE.confirmed]: 1,
    [ORDER_STAGE.shipping]: 2,
    [ORDER_STAGE.delivered]: 3,
  }[order.stage] ?? 0;

  if (orderIndex < activeIndex) {
    return "done";
  }

  if (orderIndex === activeIndex) {
    return "active";
  }

  return "upcoming";
}

const stateClasses = {
  active: "border-blue-200 bg-blue-50 text-blue-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  muted: "border-slate-200 bg-slate-50 text-slate-400",
  upcoming: "border-slate-200 bg-white text-slate-400",
};

function OrderTimeline({ order }) {
  const steps = [
    {
      at: order?.createdAt,
      description: "Order received and waiting for confirmation.",
      icon: Clock,
      key: ORDER_STAGE.pending,
      label: "Pending",
      order: 0,
    },
    {
      at: order?.status === "PROCESSING" || order?.status === "COMPLETED" ? order?.updatedAt : "",
      description: "Stock is reserved and the order is being prepared.",
      icon: PackageCheck,
      key: ORDER_STAGE.confirmed,
      label: "Confirmed",
      order: 1,
    },
    {
      at: order?.shippingStatus === "SHIPPING" || order?.shippingStatus === "DELIVERED" ? order?.updatedAt : "",
      description: order?.trackingCode ? `Tracking code: ${order.trackingCode}` : "Waiting for carrier handoff.",
      icon: Truck,
      key: ORDER_STAGE.shipping,
      label: "Shipping",
      order: 2,
    },
    {
      at: order?.shippingStatus === "DELIVERED" || order?.status === "COMPLETED" ? order?.updatedAt : "",
      description: "Customer delivery completed.",
      icon: CheckCircle2,
      key: ORDER_STAGE.delivered,
      label: "Delivered",
      order: 3,
    },
  ];

  if (order?.stage === ORDER_STAGE.cancelled) {
    steps.push({
      at: order?.updatedAt,
      description: "Order was cancelled and inventory adjustments should be reviewed.",
      icon: XCircle,
      key: ORDER_STAGE.cancelled,
      label: "Cancelled",
      order: 4,
    });
  }

  return (
    <section className="admin-panel rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-950">Order timeline</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">Operational state from checkout to delivery.</p>
        </div>
      </div>

      <ol className="mt-5 space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon || Circle;
          const state = getStepState(step, order);
          const isLast = index === steps.length - 1;

          return (
            <li className="relative flex gap-3" key={step.key}>
              {!isLast ? <span className="absolute left-5 top-11 h-[calc(100%+0.25rem)] w-px bg-slate-200" /> : null}
              <span
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
                  stateClasses[state],
                )}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black text-slate-900">{step.label}</p>
                  {formatDateTime(step.at) ? (
                    <span className="text-xs font-bold text-slate-500">{formatDateTime(step.at)}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default OrderTimeline;
