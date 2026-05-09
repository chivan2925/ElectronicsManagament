import { buildAuthSession, normalizePermissions, normalizeRoles, normalizeUser } from "../../auth/authHelpers";

export const AUTH_ACTIONS = {
  hydrate: "auth/hydrate",
  logout: "auth/logout",
  setLoading: "auth/setLoading",
  setPermissions: "auth/setPermissions",
  setRoles: "auth/setRoles",
  setSession: "auth/setSession",
  updateUser: "auth/updateUser",
};

export const initialAuthState = {
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  permissions: [],
  refreshToken: null,
  roles: [],
  user: null,
};

function createAuthState(session, loading = false) {
  const normalizedSession = buildAuthSession(session ?? {});

  return {
    accessToken: normalizedSession.accessToken,
    isAuthenticated: Boolean(normalizedSession.accessToken),
    loading,
    permissions: normalizedSession.permissions,
    refreshToken: normalizedSession.refreshToken,
    roles: normalizedSession.roles,
    user: normalizedSession.user,
  };
}

export function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.hydrate:
    case AUTH_ACTIONS.setSession:
      return createAuthState(action.payload, false);

    case AUTH_ACTIONS.logout:
      return {
        ...initialAuthState,
        loading: false,
      };

    case AUTH_ACTIONS.setLoading:
      return {
        ...state,
        loading: Boolean(action.payload),
      };

    case AUTH_ACTIONS.updateUser:
      return {
        ...state,
        user: normalizeUser({
          ...state.user,
          ...action.payload,
        }),
      };

    case AUTH_ACTIONS.setRoles:
      return {
        ...state,
        roles: normalizeRoles(action.payload),
      };

    case AUTH_ACTIONS.setPermissions:
      return {
        ...state,
        permissions: normalizePermissions(action.payload),
      };

    default:
      return state;
  }
}
