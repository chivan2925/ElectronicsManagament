import { Loader2, Save } from "lucide-react";
import { cn } from "../../../utils/classNames";

function renderField(field, values, errors, onChange) {
  const value = values?.[field.name] ?? field.value ?? "";
  const error = errors?.[field.name];
  const fieldId = field.id || `admin-form-${field.name}`;
  const inputClass = cn(
    "w-full rounded-xl border bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
    field.type === "textarea" ? "min-h-28 py-3" : "h-11",
    error ? "border-rose-300 ring-rose-100" : "border-slate-200",
  );

  if (typeof field.render === "function") {
    return field.render({ error, onChange: (nextValue) => onChange?.(field.name, nextValue), value, values });
  }

  if (field.type === "select") {
    return (
      <select
        aria-invalid={Boolean(error)}
        className={inputClass}
        disabled={field.disabled}
        id={fieldId}
        onChange={(event) => onChange?.(field.name, event.target.value)}
        required={field.required}
        value={value}
      >
        <option value="">{field.placeholder || "Select option"}</option>
        {(field.options ?? []).map((option) => {
          const optionValue = typeof option === "object" ? option.value : option;
          const optionLabel = typeof option === "object" ? option.label : option;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        aria-invalid={Boolean(error)}
        className={inputClass}
        disabled={field.disabled}
        id={fieldId}
        onChange={(event) => onChange?.(field.name, event.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        value={value}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <input
          aria-invalid={Boolean(error)}
          checked={Boolean(value)}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-200"
          disabled={field.disabled}
          id={fieldId}
          onChange={(event) => onChange?.(field.name, event.target.checked)}
          required={field.required}
          type="checkbox"
        />
        <span className="text-sm font-bold text-slate-700">{field.checkboxLabel || field.label}</span>
      </div>
    );
  }

  return (
    <input
      aria-invalid={Boolean(error)}
      className={inputClass}
      autoComplete={field.autoComplete}
      disabled={field.disabled}
      id={fieldId}
      inputMode={field.inputMode}
      max={field.max}
      min={field.min}
      onChange={(event) => onChange?.(field.name, event.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      step={field.step}
      type={field.type || "text"}
      value={value}
    />
  );
}

function AdminForm({
  cancelLabel = "Cancel",
  children,
  className,
  columns = 2,
  errors = {},
  fields = [],
  loading = false,
  onCancel,
  onChange,
  onSubmit,
  submitLabel = "Save changes",
  values = {},
}) {
  const gridClass = columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values, event);
  };

  return (
    <form className={cn("space-y-5", className)} onSubmit={handleSubmit}>
      <div className={cn("grid gap-4", gridClass)}>
        {fields.map((field) => {
          const fieldId = field.id || `admin-form-${field.name}`;
          const labelProps = field.render ? {} : { htmlFor: fieldId };

          return (
            <label className={cn("space-y-1.5", field.fullWidth && "md:col-span-2")} key={field.name} {...labelProps}>
              {field.type !== "checkbox" ? (
                <span className="text-sm font-black text-slate-700">
                  {field.label}
                  {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
                </span>
              ) : null}
              {renderField(field, values, errors, onChange)}
              {errors?.[field.name] ? (
                <span className="text-xs font-semibold text-rose-600">{errors[field.name]}</span>
              ) : field.helper ? (
                <span className="text-xs font-semibold text-slate-500">{field.helper}</span>
              ) : null}
            </label>
          );
        })}
      </div>

      {children}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
        ) : null}
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default AdminForm;
