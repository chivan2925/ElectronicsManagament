export const API_ERROR_TYPES = {
  CLIENT: "client",
  FORBIDDEN: "forbidden",
  NETWORK: "network",
  SERVER: "server",
  TIMEOUT: "timeout",
  UNAUTHORIZED: "unauthorized",
  UNKNOWN: "unknown",
};

const DEFAULT_ERROR_MESSAGES = {
  [API_ERROR_TYPES.CLIENT]: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.",
  [API_ERROR_TYPES.FORBIDDEN]: "Bạn không có quyền thực hiện thao tác này.",
  [API_ERROR_TYPES.NETWORK]: "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng hoặc backend.",
  [API_ERROR_TYPES.SERVER]: "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
  [API_ERROR_TYPES.TIMEOUT]: "Yêu cầu quá thời gian phản hồi. Vui lòng thử lại.",
  [API_ERROR_TYPES.UNAUTHORIZED]: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  [API_ERROR_TYPES.UNKNOWN]: "Đã có lỗi xảy ra. Vui lòng thử lại.",
};

function isNormalizedApiError(error) {
  return Boolean(error?.type && "status" in error && "message" in error && !error?.isAxiosError);
}

function getResponseData(error) {
  return error?.response?.data ?? {};
}

function getStatus(error, data) {
  return data?.statusCode ?? data?.status ?? error?.response?.status ?? 0;
}

function isTimeoutError(error) {
  const message = String(error?.message ?? "").toLowerCase();

  return error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT" || message.includes("timeout");
}

function getErrorType(status, error) {
  if (isTimeoutError(error)) {
    return API_ERROR_TYPES.TIMEOUT;
  }

  if (!error?.response) {
    return API_ERROR_TYPES.NETWORK;
  }

  if (status === 401) {
    return API_ERROR_TYPES.UNAUTHORIZED;
  }

  if (status === 403) {
    return API_ERROR_TYPES.FORBIDDEN;
  }

  if (status >= 500) {
    return API_ERROR_TYPES.SERVER;
  }

  if (status >= 400) {
    return API_ERROR_TYPES.CLIENT;
  }

  return API_ERROR_TYPES.UNKNOWN;
}

function getBackendMessage(data) {
  if (typeof data === "string") {
    return data;
  }

  return data?.message ?? data?.error ?? data?.title ?? null;
}

function getErrorMessage(type, data, error) {
  if ([API_ERROR_TYPES.NETWORK, API_ERROR_TYPES.TIMEOUT, API_ERROR_TYPES.UNAUTHORIZED, API_ERROR_TYPES.FORBIDDEN].includes(type)) {
    return DEFAULT_ERROR_MESSAGES[type];
  }

  if (type === API_ERROR_TYPES.SERVER) {
    return DEFAULT_ERROR_MESSAGES[type];
  }

  return getBackendMessage(data) ?? error?.message ?? DEFAULT_ERROR_MESSAGES[type] ?? DEFAULT_ERROR_MESSAGES[API_ERROR_TYPES.UNKNOWN];
}

export function normalizeApiError(error) {
  if (error?.apiError) {
    return error.apiError;
  }

  if (isNormalizedApiError(error)) {
    return error;
  }

  const data = getResponseData(error);
  const status = getStatus(error, data);
  const type = getErrorType(status, error);

  return {
    code: data?.code ?? error?.code ?? null,
    details: data?.details ?? data?.errors ?? null,
    isForbidden: type === API_ERROR_TYPES.FORBIDDEN,
    isNetworkError: type === API_ERROR_TYPES.NETWORK,
    isServerError: type === API_ERROR_TYPES.SERVER,
    isTimeout: type === API_ERROR_TYPES.TIMEOUT,
    isUnauthorized: type === API_ERROR_TYPES.UNAUTHORIZED,
    message: getErrorMessage(type, data, error),
    method: error?.config?.method?.toUpperCase() ?? null,
    path: data?.path ?? error?.config?.url ?? null,
    status,
    type,
    url: error?.config?.url ?? null,
  };
}

export default normalizeApiError;
