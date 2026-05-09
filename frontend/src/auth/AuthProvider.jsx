import { useCallback, useEffect, useMemo, useReducer } from "react";
import AuthContext from "./AuthContext";
import {
  canAccessAdmin as checkCanAccessAdmin,
  canAccessStaff as checkCanAccessStaff,
  buildAuthSession,
  hasAnyPermission as checkHasAnyPermission,
  hasAnySessionRole as checkHasAnySessionRole,
  hasEveryPermission as checkHasEveryPermission,
  hasPermission as checkHasPermission,
  hasSessionRole as checkHasSessionRole,
  isAdminSession as checkIsAdminSession,
  isStaffSession as checkIsStaffSession,
} from "./authHelpers";
import { AUTH_EVENTS, clearAuthSession, getStoredAuthSession, persistAuthSession } from "./authStorage";
import { restoreAuthSession } from "../api/refreshTokenService";
import { AUTH_ACTIONS, authReducer, initialAuthState } from "../store/auth";

function hydrateInitialAuthState(initialState) {
  const storedSession = getStoredAuthSession();

  if (!storedSession) {
    return authReducer(initialState, {
      payload: null,
      type: AUTH_ACTIONS.hydrate,
    });
  }

  const hydratedState = authReducer(initialState, {
    payload: storedSession,
    type: AUTH_ACTIONS.hydrate,
  });

  return {
    ...hydratedState,
    loading: true,
  };
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, hydrateInitialAuthState);

  useEffect(() => {
    if (!state.loading) {
      return undefined;
    }

    let isActive = true;

    restoreAuthSession()
      .then((session) => {
        if (!isActive) {
          return;
        }

        if (session) {
          dispatch({
            payload: session,
            type: AUTH_ACTIONS.setSession,
          });
          return;
        }

        dispatch({ type: AUTH_ACTIONS.logout });
      })
      .catch(() => {
        if (isActive) {
          dispatch({ type: AUTH_ACTIONS.logout });
        }
      });

    return () => {
      isActive = false;
    };
  }, [state.loading]);

  useEffect(() => {
    if (state.loading) {
      return;
    }

    if (state.isAuthenticated) {
      persistAuthSession(state);
    } else {
      clearAuthSession();
    }
  }, [state]);

  useEffect(() => {
    const handleSessionChanged = (event) => {
      dispatch({
        payload: event.detail ?? getStoredAuthSession(),
        type: AUTH_ACTIONS.setSession,
      });
    };

    const handleUnauthorized = () => {
      clearAuthSession();
      dispatch({ type: AUTH_ACTIONS.logout });
    };

    window.addEventListener(AUTH_EVENTS.sessionChanged, handleSessionChanged);
    window.addEventListener(AUTH_EVENTS.unauthorized, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_EVENTS.sessionChanged, handleSessionChanged);
      window.removeEventListener(AUTH_EVENTS.unauthorized, handleUnauthorized);
    };
  }, []);

  const setAuthSession = useCallback((payload) => {
    const session = buildAuthSession(payload);
    persistAuthSession(session);
    dispatch({
      payload: session,
      type: AUTH_ACTIONS.setSession,
    });
    return session;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    dispatch({ type: AUTH_ACTIONS.logout });
  }, []);

  const updateUser = useCallback((user) => {
    dispatch({
      payload: user,
      type: AUTH_ACTIONS.updateUser,
    });
  }, []);

  const setRoles = useCallback((roles) => {
    dispatch({
      payload: roles,
      type: AUTH_ACTIONS.setRoles,
    });
  }, []);

  const setPermissions = useCallback((permissions) => {
    dispatch({
      payload: permissions,
      type: AUTH_ACTIONS.setPermissions,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      canAccessAdmin: () => checkCanAccessAdmin(state),
      canAccessStaff: () => checkCanAccessStaff(state),
      clearAuth: logout,
      hasAnyPermission: (permissions) => checkHasAnyPermission(state.permissions, permissions),
      hasAnyRole: (roles) => checkHasAnySessionRole(state, roles),
      hasEveryPermission: (permissions) => checkHasEveryPermission(state.permissions, permissions),
      hasPermission: (permission) => checkHasPermission(state.permissions, permission),
      hasRole: (role) => checkHasSessionRole(state, role),
      isAdmin: () => checkIsAdminSession(state),
      isStaff: () => checkIsStaffSession(state),
      login: setAuthSession,
      logout,
      setAuthSession,
      setPermissions,
      setRoles,
      updateUser,
    }),
    [logout, setAuthSession, setPermissions, setRoles, state, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
