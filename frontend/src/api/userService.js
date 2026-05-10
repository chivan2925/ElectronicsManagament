import { api } from "./client";
import { buildUpdateProfilePayload, normalizeAccountProfile } from "./accountMapper";
import { normalizeAdminUser, normalizeAdminUserPage } from "./adminPeopleMapper";
import { cleanParams } from "./mapperUtils";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = import.meta.env.VITE_USER_API_PATH || "/admin/users";
const ACCOUNT_RESOURCE_PATH = import.meta.env.VITE_USER_PROFILE_API_PATH || "/users";
const adminUserService = createResourceService(RESOURCE_PATH);

export const { create, update } = adminUserService;

export async function getAll(params = {}, config = {}) {
  const data = await adminUserService.getAll(cleanParams(params), config);
  return normalizeAdminUserPage(data);
}

export async function getById(id, config = {}) {
  const data = await adminUserService.getById(id, config);
  return normalizeAdminUser(data);
}

export async function remove(id, config = {}) {
  return adminUserService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeAdminUser(data);
}

export async function getCurrentUserProfile(userId, config = {}) {
  if (!userId) {
    return null;
  }

  const data = await api.get(`${ACCOUNT_RESOURCE_PATH}/${userId}/profile`, {
    skipGlobalErrorHandler: true,
    ...config,
  });

  return normalizeAccountProfile(data);
}

export async function updateCurrentUserProfile(userId, values, config = {}) {
  if (!userId) {
    return null;
  }

  const data = await api.put(`${ACCOUNT_RESOURCE_PATH}/${userId}/profile`, buildUpdateProfilePayload(values), {
    skipGlobalErrorHandler: true,
    ...config,
  });

  return normalizeAccountProfile(data);
}

const userService = {
  ...adminUserService,
  create,
  getAll,
  getById,
  getCurrentUserProfile,
  remove,
  update,
  updateStatus,
  updateCurrentUserProfile,
};

export default userService;
