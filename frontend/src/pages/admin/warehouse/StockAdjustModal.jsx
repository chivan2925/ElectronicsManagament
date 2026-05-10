import { cloneElement, isValidElement, useMemo } from "react";
import { Loader2, PackageCheck, X } from "lucide-react";
import { AdminModal } from "../../../admin/components";
import FormFieldMessage from "../../../components/ui/form/FormFieldMessage";
import { cn } from "../../../utils/classNames";
import { getFormFieldDescribedBy } from "../../../utils/formValidation";

const TYPE_OPTIONS = [
  { helper: "Increase on-hand quantity", label: "Stock in", tone: "emerald", value: "IMPORT" },
  { helper: "Decrease on-hand quantity", label: "Stock out", tone: "rose", value: "EXPORT" },
  { helper: "Returned stock", label: "Return", tone: "blue", value: "RETURN" },
];

function Field({ children, error, id, label, required = false }) {
  const fieldId = id || label;
  const hasError = Boolean(error);
  const errorId = `${fieldId}-error`;
  const describedBy = getFormFieldDescribedBy({ errorId, hasError });
  const canEnhanceChild = isValidElement(children) && ["input", "select", "textarea"].includes(children.type);
  const content = canEnhanceChild
    ? cloneElement(children, {
        "aria-describedby": describedBy,
        "aria-invalid": hasError,
        className: cn(children.props.className, hasError && "border-rose-300 ring-2 ring-rose-100"),
        id: children.props.id || fieldId,
        name: children.props.name || fieldId,
      })
    : children;

  return (
    <div className="space-y-1.5" data-field-name={fieldId}>
      <label className="block text-xs font-black uppercase tracking-normal text-slate-500" htmlFor={fieldId}>
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {content}
      <FormFieldMessage id={errorId} surface="admin" tone="error">
        {error}
      </FormFieldMessage>
    </div>
  );
}

function TypeOption({ active, disabled = false, option, onClick }) {
  const activeTone = {
    blue: "border-blue-200 bg-blue-50 text-primary",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <button
      aria-pressed={active}
      className={cn(
        "rounded-xl border px-3 py-2 text-left transition hover:border-primary hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60",
        active ? activeTone[option.tone] : "border-slate-200 bg-white text-slate-700",
      )}
      disabled={disabled}
      onClick={() => onClick?.(option.value)}
      type="button"
    >
      <p className="text-sm font-black">{option.label}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-500">{option.helper}</p>
    </button>
  );
}

function uniqueOptions(options) {
  const seen = new Set();

  return options.filter((option) => {
    const key = String(option.value ?? "");

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function StockAdjustModal({
  errors = {},
  loadingOptions = false,
  onChange,
  onClose,
  onSubmit,
  open = false,
  selectedStock = null,
  submitting = false,
  values = {},
  variants = [],
  warehouses = [],
}) {
  const lockStockTarget = Boolean(selectedStock);

  const warehouseOptions = useMemo(
    () =>
      uniqueOptions([
        selectedStock
          ? {
              label: selectedStock.warehouseName,
              value: String(selectedStock.warehouseId),
            }
          : null,
        ...warehouses.map((warehouse) => ({
          label: warehouse.name,
          value: String(warehouse.apiId ?? warehouse.id),
        })),
      ].filter(Boolean)),
    [selectedStock, warehouses],
  );

  const variantOptions = useMemo(
    () =>
      uniqueOptions([
        selectedStock
          ? {
              label: selectedStock.sku ? `${selectedStock.variantName} (${selectedStock.sku})` : selectedStock.variantName,
              value: String(selectedStock.variantId),
            }
          : null,
        ...variants.map((variant) => ({
          label: variant.sku ? `${variant.name} (${variant.sku})` : variant.name,
          value: String(variant.apiId ?? variant.id),
        })),
      ].filter(Boolean)),
    [selectedStock, variants],
  );

  const footer = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={submitting}
        onClick={onClose}
        type="button"
      >
        <X size={16} />
        Cancel
      </button>
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-admin-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={submitting || loadingOptions}
        onClick={onSubmit}
        type="button"
      >
        {submitting ? <Loader2 className="animate-spin" size={16} /> : <PackageCheck size={16} />}
        Save adjustment
      </button>
    </div>
  );

  return (
    <AdminModal
      description={selectedStock ? `${selectedStock.variantName} · ${selectedStock.warehouseName}` : "Create a stock movement"}
      footer={footer}
      onClose={submitting ? undefined : onClose}
      open={open}
      size="lg"
      title="Inventory adjustment"
    >
      <div aria-busy={submitting} className="space-y-4">
        {selectedStock ? (
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-slate-500">Current stock</p>
              <p className="mt-1 text-xl font-black text-slate-950">{selectedStock.quantity}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-slate-500">Variant</p>
              <p className="mt-1 truncate text-sm font-black text-slate-800">{selectedStock.variantName}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-slate-500">Warehouse</p>
              <p className="mt-1 truncate text-sm font-black text-slate-800">{selectedStock.warehouseName}</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <Field error={errors.warehouseId} id="warehouseId" label="Warehouse" required>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={lockStockTarget || loadingOptions || submitting}
              onChange={(event) => onChange?.("warehouseId", event.target.value)}
              value={values.warehouseId ?? ""}
            >
              <option value="">Select warehouse</option>
              {warehouseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field error={errors.variantId} id="variantId" label="Variant" required>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={lockStockTarget || loadingOptions || submitting}
              onChange={(event) => onChange?.("variantId", event.target.value)}
              value={values.variantId ?? ""}
            >
              <option value="">Select variant</option>
              {variantOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field error={errors.type} id="type" label="Movement type" required>
          <div className="grid gap-2 sm:grid-cols-3">
            {TYPE_OPTIONS.map((option) => (
              <TypeOption active={values.type === option.value} disabled={submitting} key={option.value} onClick={(nextType) => onChange?.("type", nextType)} option={option} />
            ))}
          </div>
        </Field>

        <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
          <Field error={errors.quantity} id="quantity" label="Quantity" required>
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={submitting}
              min="1"
              onChange={(event) => onChange?.("quantity", event.target.value)}
              type="number"
              value={values.quantity ?? 1}
            />
          </Field>

          <Field error={errors.note} id="note" label="Note">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={submitting}
              maxLength={255}
              onChange={(event) => onChange?.("note", event.target.value)}
              placeholder="Cycle count, receiving, damaged item..."
              type="text"
              value={values.note ?? ""}
            />
          </Field>
        </div>
      </div>
    </AdminModal>
  );
}

export default StockAdjustModal;
