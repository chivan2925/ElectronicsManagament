import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";
import FormFieldMessage from "../../../components/ui/form/FormFieldMessage";
import { cn } from "../../../utils/classNames";
import { focusFirstInvalidField, getFormFieldDescribedBy } from "../../../utils/formValidation";

function renderField(field, values, errors, onChange, formLoading = false) {
  const value = values?.[field.name] ?? field.value ?? "";
  const error = errors?.[field.name];
  const hasError = Boolean(error);
  const hasHelper = Boolean(field.helper);
  const fieldId = field.id || `admin-form-${field.name}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const describedBy = getFormFieldDescribedBy({ errorId, hasError, hasHelper, helperId });
  const disabled = formLoading || field.disabled;
  const inputClass = cn(
    "w-full rounded-xl border bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
    field.type === "textarea" ? "min-h-28 py-3" : "h-11",
    hasError ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200",
  );

  if (typeof field.render === "function") {
    return field.render({
      describedBy,
      disabled,
      error,
      errorId,
      fieldId,
      helperId,
      onChange: (nextValue) => onChange?.(field.name, nextValue),
      value,
      values,
    });
  }

  if (field.type === "select") {
    return (
      <select
        aria-describedby={describedBy}
        aria-invalid={hasError}
        className={inputClass}
        disabled={disabled}
        id={fieldId}
        onChange={(event) => onChange?.(field.name, event.target.value)}
        required={field.required}
        value={value}
      >
        <option value="">{field.placeholder || "Chọn tùy chọn"}</option>
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
        aria-describedby={describedBy}
        aria-invalid={hasError}
        className={inputClass}
        disabled={disabled}
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
      <label
        className={cn(
          "inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5",
          disabled && "cursor-not-allowed opacity-70",
        )}
        htmlFor={fieldId}
      >
        <input
          aria-describedby={describedBy}
          aria-invalid={hasError}
          checked={Boolean(value)}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-200"
          disabled={disabled}
          id={fieldId}
          onChange={(event) => onChange?.(field.name, event.target.checked)}
          required={field.required}
          type="checkbox"
        />
        <span className="text-sm font-bold text-slate-700">{field.checkboxLabel || field.label}</span>
      </label>
    );
  }

  return (
    <input
      aria-describedby={describedBy}
      aria-invalid={hasError}
      className={inputClass}
      autoComplete={field.autoComplete}
      disabled={disabled}
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
  cancelLabel = "Hủy",
  children,
  className,
  columns = 2,
  errors = {},
  fields = [],
  loading = false,
  onCancel,
  onChange,
  onSubmit,
  submitLabel = "Lưu thay đổi",
  values = {},
}) {
  const gridClass = columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";
  const [submitNonce, setSubmitNonce] = useState(0);
  const lastFocusedSubmitRef = useRef(0);
  const fieldOrder = useMemo(() => fields.map((field) => field.name), [fields]);

  useEffect(() => {
    const hasErrors = Object.values(errors).some(Boolean);

    if (!hasErrors || submitNonce === lastFocusedSubmitRef.current) {
      return;
    }

    focusFirstInvalidField(errors, fieldOrder);
    lastFocusedSubmitRef.current = submitNonce;
  }, [errors, fieldOrder, submitNonce]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitNonce((currentNonce) => currentNonce + 1);
    onSubmit?.(values, event);
  };

  return (
    <form aria-busy={loading} className={cn("space-y-5", className)} noValidate onSubmit={handleSubmit}>
      <div className={cn("grid gap-4", gridClass)}>
        {fields.map((field) => {
          const fieldId = field.id || `admin-form-${field.name}`;
          const errorId = `${fieldId}-error`;
          const helperId = `${fieldId}-helper`;
          const error = errors?.[field.name];

          return (
            <div
              className={cn("space-y-1.5", field.fullWidth && "md:col-span-2")}
              data-field-name={field.name}
              key={field.name}
            >
              {field.type !== "checkbox" ? (
                <label className="block text-sm font-black text-slate-700" htmlFor={fieldId}>
                  {field.label}
                  {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
                </label>
              ) : null}
              {renderField(field, values, errors, onChange, loading)}
              <FormFieldMessage id={errorId} surface="admin" tone="error">
                {error}
              </FormFieldMessage>
              {!error && (
                <FormFieldMessage id={helperId} surface="admin" tone="helper">
                  {field.helper}
                </FormFieldMessage>
              )}
            </div>
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
