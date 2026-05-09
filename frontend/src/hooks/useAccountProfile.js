import { useCallback, useEffect, useMemo, useState } from "react";
import userService from "../api/userService";
import useAuth from "../auth/useAuth";
import { normalizeAccountProfile } from "../api/accountMapper";

function useAccountProfile() {
  const auth = useAuth();
  const userId = auth.user?.id ?? null;
  const fallbackProfile = useMemo(() => normalizeAccountProfile(null, auth.user ?? {}), [auth.user]);
  const [error, setError] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profile, setProfile] = useState(fallbackProfile);

  const fetchProfile = useCallback(async () => {
    if (!auth.isAuthenticated || !userId) {
      setProfile(fallbackProfile);
      return fallbackProfile;
    }

    setIsLoadingProfile(true);
    setError(null);

    try {
      const nextProfile = await userService.getCurrentUserProfile(userId);
      const normalizedProfile = normalizeAccountProfile(nextProfile, fallbackProfile);

      setProfile(normalizedProfile);
      return normalizedProfile;
    } catch (profileError) {
      setProfile(fallbackProfile);
      setError(profileError);
      return fallbackProfile;
    } finally {
      setIsLoadingProfile(false);
    }
  }, [auth.isAuthenticated, fallbackProfile, userId]);

  const updateProfile = useCallback(
    async (values) => {
      if (!userId) {
        return null;
      }

      setIsSavingProfile(true);
      setError(null);

      try {
        const savedProfile = await userService.updateCurrentUserProfile(userId, values);
        const normalizedProfile = normalizeAccountProfile(savedProfile, profile);

        setProfile(normalizedProfile);
        auth.updateUser({
          ...normalizedProfile,
          phone: normalizedProfile.phoneNumber,
        });

        return normalizedProfile;
      } catch (profileError) {
        setError(profileError);
        throw profileError;
      } finally {
        setIsSavingProfile(false);
      }
    },
    [auth, profile, userId],
  );

  useEffect(() => {
    let isActive = true;

    fetchProfile().then((nextProfile) => {
      if (isActive && nextProfile) {
        setProfile(nextProfile);
      }
    });

    return () => {
      isActive = false;
    };
  }, [fetchProfile]);

  return {
    error,
    isLoadingProfile,
    isSavingProfile,
    profile,
    refreshProfile: fetchProfile,
    updateProfile,
    userId,
  };
}

export default useAccountProfile;
