import { useMemo } from "react";
import { Check, Minus, Search, ShieldCheck } from "lucide-react";
import { cn } from "../../../utils/classNames";

const ACTION_ORDER = ["view", "create", "update", "delete", "manage", "access"];

function getPermissionId(permission) {
  return permission?.id ?? permission?.permissionId ?? permission?.code ?? permission?.name;
}

function getPermissionCode(permission) {
  return String(permission?.code ?? permission?.name ?? "").trim();
}

function getAction(permission) {
  if (permission?.action) {
    return permission.action;
  }

  const code = getPermissionCode(permission).toLowerCase().replace(/[._\s]+/g, ":");
  const parts = code.split(":").filter(Boolean);

  return parts.length > 1 ? parts.at(-1) : "access";
}

function getResource(permission) {
  if (permission?.resource) {
    return permission.resource;
  }

  const code = getPermissionCode(permission).toLowerCase().replace(/[._\s]+/g, ":");
  const parts = code.split(":").filter(Boolean);

  return parts.length > 1 ? parts.slice(0, -1).join(":") : "system";
}

function toReadableLabel(value) {
  return String(value ?? "")
    .replace(/[:._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function sortActions(first, second) {
  const firstIndex = ACTION_ORDER.indexOf(first);
  const secondIndex = ACTION_ORDER.indexOf(second);

  if (firstIndex !== -1 || secondIndex !== -1) {
    return (firstIndex === -1 ? ACTION_ORDER.length : firstIndex) - (secondIndex === -1 ? ACTION_ORDER.length : secondIndex);
  }

  return first.localeCompare(second);
}

function createGroups(permissions) {
  const groupMap = new Map();

  permissions.forEach((permission) => {
    const resource = getResource(permission);
    const action = getAction(permission);
    const group = groupMap.get(resource) ?? {
      actions: new Map(),
      key: resource,
      label: permission.groupLabel || toReadableLabel(resource),
      permissions: [],
    };

    const actionPermissions = group.actions.get(action) ?? [];
    actionPermissions.push(permission);
    group.actions.set(action, actionPermissions);
    group.permissions.push(permission);
    groupMap.set(resource, group);
  });

  return Array.from(groupMap.values()).sort((first, second) => first.label.localeCompare(second.label));
}

function filterPermissions(permissions, query) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return permissions;
  }

  return permissions.filter((permission) => {
    const values = [
      permission.name,
      permission.code,
      permission.description,
      permission.groupLabel,
      permission.actionLabel,
      getResource(permission),
      getAction(permission),
    ];

    return values.some((value) => String(value ?? "").toLowerCase().includes(keyword));
  });
}

function PermissionCell({ disabled, onToggle, permission, readOnly, selected }) {
  if (!permission) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
        <Minus size={15} />
      </span>
    );
  }

  if (readOnly) {
    return (
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1",
          selected ? "bg-emerald-50 text-emerald-600 ring-emerald-100" : "bg-slate-50 text-slate-300 ring-slate-100",
        )}
        title={permission.name}
      >
        {selected ? <Check size={16} /> : <Minus size={15} />}
      </span>
    );
  }

  return (
    <label
      className={cn(
        "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition",
        selected
          ? "border-primary bg-blue-50 text-primary shadow-sm shadow-blue-100"
          : "border-slate-200 bg-white text-slate-300 hover:border-primary hover:text-primary",
        disabled && "cursor-not-allowed opacity-50",
      )}
      title={permission.name}
    >
      <input
        aria-label={`Toggle ${permission.name || permission.code}`}
        checked={selected}
        className="sr-only"
        disabled={disabled}
        onChange={() => onToggle(permission)}
        type="checkbox"
      />
      {selected ? <Check size={16} /> : <Minus size={15} />}
    </label>
  );
}

function PermissionMatrix({
  className,
  disabled = false,
  onChange,
  onSearchChange,
  permissions = [],
  readOnly = false,
  search = "",
  selectedIds = [],
  showSearch = false,
  title = "Permission matrix",
}) {
  const selectedSet = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);
  const visiblePermissions = useMemo(() => filterPermissions(permissions, search), [permissions, search]);
  const groups = useMemo(() => createGroups(visiblePermissions), [visiblePermissions]);
  const actions = useMemo(
    () => Array.from(new Set(visiblePermissions.map(getAction))).sort(sortActions),
    [visiblePermissions],
  );
  const selectableIds = useMemo(
    () => permissions.map(getPermissionId).filter((id) => id !== null && id !== undefined && id !== ""),
    [permissions],
  );
  const selectedCount = selectableIds.filter((id) => selectedSet.has(String(id))).length;
  const isReadOnly = readOnly || !onChange;

  const setSelectedIds = (nextIds) => {
    onChange?.(Array.from(nextIds).map((id) => (Number.isInteger(Number(id)) ? Number(id) : id)));
  };

  const togglePermission = (permission) => {
    const permissionId = getPermissionId(permission);

    if (permissionId === null || permissionId === undefined || permissionId === "") {
      return;
    }

    const nextIds = new Set(selectedSet);
    const key = String(permissionId);

    if (nextIds.has(key)) {
      nextIds.delete(key);
    } else {
      nextIds.add(key);
    }

    setSelectedIds(nextIds);
  };

  const toggleGroup = (group) => {
    const groupIds = group.permissions.map(getPermissionId).filter((id) => id !== null && id !== undefined && id !== "");
    const nextIds = new Set(selectedSet);
    const allSelected = groupIds.every((id) => nextIds.has(String(id)));

    groupIds.forEach((id) => {
      if (allSelected) {
        nextIds.delete(String(id));
      } else {
        nextIds.add(String(id));
      }
    });

    setSelectedIds(nextIds);
  };

  return (
    <section className={cn("admin-panel overflow-hidden rounded-2xl", className)}>
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07111F] text-white">
            <ShieldCheck size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-950">{title}</h3>
            <p className="text-xs font-semibold text-slate-500">
              {selectedCount}/{selectableIds.length} permissions selected
            </p>
          </div>
        </div>

        {showSearch ? (
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search permissions..."
              type="search"
              value={search}
            />
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              <th className="sticky left-0 z-10 min-w-[220px] bg-white px-4 py-3 text-left text-xs font-black uppercase tracking-normal text-slate-500">
                Resource
              </th>
              {actions.map((action) => (
                <th className="min-w-28 px-4 py-3 text-center text-xs font-black uppercase tracking-normal text-slate-500" key={action}>
                  {toReadableLabel(action)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {groups.length > 0 ? (
              groups.map((group) => {
                const groupIds = group.permissions.map(getPermissionId).filter((id) => id !== null && id !== undefined && id !== "");
                const selectedInGroup = groupIds.filter((id) => selectedSet.has(String(id))).length;
                const allSelected = groupIds.length > 0 && selectedInGroup === groupIds.length;

                return (
                  <tr className="hover:bg-slate-50" key={group.key}>
                    <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
                      <div className="flex items-center gap-3">
                        {!isReadOnly ? (
                          <input
                            aria-label={`Toggle ${group.label} permissions`}
                            checked={allSelected}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-200"
                            disabled={disabled || groupIds.length === 0}
                            onChange={() => toggleGroup(group)}
                            type="checkbox"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900">{group.label}</p>
                          <p className="text-xs font-semibold text-slate-500">
                            {selectedInGroup}/{group.permissions.length} granted
                          </p>
                        </div>
                      </div>
                    </td>
                    {actions.map((action) => {
                      const actionPermissions = group.actions.get(action) ?? [];
                      const permission = actionPermissions[0] ?? null;
                      const permissionId = getPermissionId(permission);
                      const selected = permissionId !== null && permissionId !== undefined && selectedSet.has(String(permissionId));

                      return (
                        <td className="px-4 py-3 text-center" key={`${group.key}-${action}`}>
                          <PermissionCell
                            disabled={disabled}
                            onToggle={togglePermission}
                            permission={permission}
                            readOnly={isReadOnly}
                            selected={selected}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-sm font-semibold text-slate-500" colSpan={actions.length + 1 || 2}>
                  No permissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PermissionMatrix;
