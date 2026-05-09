import { api } from "./client";
import { buildUpdateProfilePayload, normalizeAccountProfile } from "./accountMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = import.meta.env.VITE_USER_API_PATH || "/admin/users";
const ACCOUNT_RESOURCE_PATH = import.meta.env.VITE_USER_PROFILE_API_PATH || "/users";
const adminUserService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = adminUserService;

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
  updateCurrentUserProfile,
};

export default userService;
