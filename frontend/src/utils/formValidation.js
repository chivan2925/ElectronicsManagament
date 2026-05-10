export function createTouchedMap(fieldNames = []) {
  return fieldNames.reduce(
    (fields, fieldName) => ({
      ...fields,
      [fieldName]: true,
    }),
    {},
  );
}

export function getVisibleFieldErrors(
  validationErrors = {},
  touchedFields = {},
  submitAttempted = false,
  extraErrors = {},
) {
  const visibleErrors = {};

  Object.entries(validationErrors).forEach(([fieldName, error]) => {
    if (error && (submitAttempted || touchedFields[fieldName])) {
      visibleErrors[fieldName] = error;
    }
  });

  Object.entries(extraErrors).forEach(([fieldName, error]) => {
    if (error) {
      visibleErrors[fieldName] = error;
    }
  });

  return visibleErrors;
}

export function getFormFieldDescribedBy({ errorId, helperId, hasError = false, hasHelper = false }) {
  return [hasError ? errorId : null, !hasError && hasHelper ? helperId : null].filter(Boolean).join(" ") || undefined;
}

export function getFirstErrorFieldName(errors = {}, fieldOrder = []) {
  const orderedField = fieldOrder.find((fieldName) => errors[fieldName]);

  if (orderedField) {
    return orderedField;
  }

  return Object.keys(errors).find((fieldName) => errors[fieldName]) || null;
}

function escapeCssIdentifier(value) {
  const stringValue = String(value);

  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(stringValue);
  }

  return stringValue.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

export function focusFirstInvalidField(errors = {}, fieldOrder = []) {
  if (typeof document === "undefined") {
    return null;
  }

  const fieldName = getFirstErrorFieldName(errors, fieldOrder);

  if (!fieldName) {
    return null;
  }

  const escapedFieldName = escapeCssIdentifier(fieldName);

  window.requestAnimationFrame(() => {
    const target = document.querySelector(
      [
        `[data-field-name="${escapedFieldName}"] input:not([type="hidden"]):not([disabled])`,
        `[data-field-name="${escapedFieldName}"] textarea:not([disabled])`,
        `[data-field-name="${escapedFieldName}"] select:not([disabled])`,
        `[name="${escapedFieldName}"]:not([disabled])`,
        `#${escapedFieldName}:not([disabled])`,
      ].join(", "),
    );

    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  return fieldName;
}
