import { api } from "./client";
import {
  buildStaffCreatePayload,
  buildStaffUpdatePayload,
  normalizeAdminStaff,
  normalizeAdminStaffPage,
} from "./adminPeopleMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/staffs";
const baseStaffService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await baseStaffService.getAll(cleanParams(params), config);
  return normalizeAdminStaffPage(data);
}

export async function getById(id, config = {}) {
  const data = await baseStaffService.getById(id, config);
  return normalizeAdminStaff(data);
}

export async function create(payload, config = {}) {
  const data = await baseStaffService.create(buildStaffCreatePayload(payload), config);
  return normalizeAdminStaff(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseStaffService.update(id, buildStaffUpdatePayload(payload), config);
  return normalizeAdminStaff(data);
}

export async function remove(id, config = {}) {
  return baseStaffService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeAdminStaff(data);
}

export async function resetPassword(id, config = {}) {
  return api.post(`${RESOURCE_PATH}/${id}/reset-password`, null, config);
}

const staffService = {
  create,
  getAll,
  getById,
  remove,
  resetPassword,
  update,
  updateStatus,
};

export default staffService;
