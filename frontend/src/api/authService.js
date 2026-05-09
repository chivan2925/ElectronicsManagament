import client, { ACCESS_TOKEN_KEY } from "./client";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function login(credentials) {
  const response = await client.post("/admin/auth/login", credentials);
  const token = response.data?.accessToken;

  if (token) {
    setAccessToken(token);
  }

  return response.data;
}

export async function logout() {
  try {
    const response = await client.post("/admin/auth/logout");
    return response.data;
  } finally {
    clearAccessToken();
  }
}

const authService = {
  clearAccessToken,
  getAccessToken,
  login,
  logout,
  setAccessToken,
};

export default authService;
