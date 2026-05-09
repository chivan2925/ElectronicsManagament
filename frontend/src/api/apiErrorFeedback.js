import { API_ERROR_TYPES, normalizeApiError } from "./normalizeApiError";

const DEFAULT_TITLES = {
  [API_ERROR_TYPES.CLIENT]: "Yêu cầu chưa hợp lệ",
  [API_ERROR_TYPES.FORBIDDEN]: "Không đủ quyền",
  [API_ERROR_TYPES.NETWORK]: "Không kết nối được",
  [API_ERROR_TYPES.SERVER]: "Lỗi hệ thống",
  [API_ERROR_TYPES.TIMEOUT]: "Yêu cầu quá lâu",
  [API_ERROR_TYPES.UNAUTHORIZED]: "Phiên đăng nhập hết hạn",
  [API_ERROR_TYPES.UNKNOWN]: "Có lỗi xảy ra",
  validation: "Dữ liệu chưa hợp lệ",
};

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringifyDetailValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (isPlainObject(value)) {
    const label = value.field ?? value.name ?? value.property ?? value.path ?? null;
    const message = value.message ?? value.defaultMessage ?? value.error ?? value.reason ?? null;

    if (label && message) {
      return `${label}: ${message}`;
    }

    if (message) {
      return String(message);
    }
  }

  return null;
}

export function getApiErrorDetailItems(details) {
  if (!details) {
    return [];
  }

  if (Array.isArray(details)) {
    return details
      .flatMap((detail) => {
        if (Array.isArray(detail)) {
          return getApiErrorDetailItems(detail);
        }

        const value = stringifyDetailValue(detail);
        return value ? [value] : [];
      })
      .filter(Boolean);
  }

  if (isPlainObject(details)) {
    return Object.entries(details)
      .flatMap(([field, value]) => {
        if (Array.isArray(value)) {
          return value.map((item) => `${field}: ${stringifyDetailValue(item) ?? item}`).filter(Boolean);
        }

        const message = stringifyDetailValue(value);
        return message ? [`${field}: ${message}`] : [];
      })
      .filter(Boolean);
  }

  const value = stringifyDetailValue(details);
  return value ? [value] : [];
}

export function getApiErrorTitle(error) {
  const apiError = normalizeApiError(error);

  if (apiError.isValidationError) {
    return DEFAULT_TITLES.validation;
  }

  return DEFAULT_TITLES[apiError.type] ?? DEFAULT_TITLES[API_ERROR_TYPES.UNKNOWN];
}

export function getApiErrorTone(error) {
  const apiError = normalizeApiError(error);

  if (apiError.isForbidden || apiError.isValidationError) {
    return "warning";
  }

  if (apiError.isUnauthorized) {
    return "info";
  }

  return "error";
}

export function buildApiErrorFeedback(error, overrides = {}) {
  const apiError = normalizeApiError(error);

  return {
    ...apiError,
    detailItems: getApiErrorDetailItems(apiError.details),
    message: overrides.message ?? apiError.message,
    title: overrides.title ?? getApiErrorTitle(apiError),
    tone: overrides.tone ?? getApiErrorTone(apiError),
  };
}
