import { normalizeApiError } from "./normalizeApiError";

export { normalizeApiError };
export { buildApiErrorFeedback, getApiErrorDetailItems, getApiErrorTitle, getApiErrorTone } from "./apiErrorFeedback";

function includesAny(value, terms) {
  const normalizedValue = String(value ?? "").toLowerCase();

  return terms.some((term) => normalizedValue.includes(term));
}

export function getLoginErrorFeedback(error) {
  const normalizedError = normalizeApiError(error);
  const disabledAccountTerms = ["disabled", "locked", "blocked", "inactive", "deleted", "khóa", "khoá", "vô hiệu", "chặn"];

  if (normalizedError.isTimeout) {
    return {
      ...normalizedError,
      message: "Máy chủ phản hồi quá lâu. Vui lòng thử đăng nhập lại.",
      tone: "error",
      type: "timeout",
    };
  }

  if (normalizedError.isNetworkError) {
    return {
      ...normalizedError,
      message: "Không thể kết nối máy chủ. Vui lòng kiểm tra backend hoặc kết nối mạng.",
      tone: "error",
      type: "network",
    };
  }

  if ([403, 423].includes(normalizedError.status) || includesAny(normalizedError.message, disabledAccountTerms)) {
    return {
      ...normalizedError,
      message: "Tài khoản đang bị khóa hoặc chưa được kích hoạt. Vui lòng liên hệ quản trị viên.",
      tone: "error",
      type: "disabled",
    };
  }

  if ([400, 401].includes(normalizedError.status)) {
    return {
      ...normalizedError,
      message: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
      tone: "error",
      type: "invalid_credentials",
    };
  }

  return {
    ...normalizedError,
    message: normalizedError.message || "Đăng nhập chưa thành công. Vui lòng thử lại sau.",
    tone: "error",
    type: "unknown",
  };
}
