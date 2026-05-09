import { useEffect, useState } from "react";
import { normalizeAccountProfile } from "../api/accountMapper";
import userService from "../api/userService";
import useAuth from "../auth/useAuth";

function getCheckoutProfile(raw, fallbackUser = {}) {
  const profile = normalizeAccountProfile(raw, fallbackUser);

  return {
    email: profile.email,
    fullName: profile.fullName,
    phone: profile.phoneNumber ?? profile.phone,
  };
}

function useCheckoutProfile() {
  const { isAuthenticated, user } = useAuth();
  const userEmail = user?.email ?? "";
  const userFullName = user?.fullName ?? "";
  const userId = user?.id ?? null;
  const userPhone = user?.phone ?? "";
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profile, setProfile] = useState(() =>
    getCheckoutProfile(null, {
      email: userEmail,
      fullName: userFullName,
      phone: userPhone,
    }),
  );

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isAuthenticated || !userId) {
          return null;
        }

        setIsLoadingProfile(true);
        return userService.getCurrentUserProfile(userId);
      })
      .then((apiProfile) => {
        if (!isActive) {
          return;
        }

        setProfile(
          getCheckoutProfile(apiProfile, {
            email: userEmail,
            fullName: userFullName,
            phone: userPhone,
          }),
        );
      })
      .catch(() => {
        if (isActive) {
          setProfile(
            getCheckoutProfile(null, {
              email: userEmail,
              fullName: userFullName,
              phone: userPhone,
            }),
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, userEmail, userFullName, userId, userPhone]);

  return {
    isLoadingProfile,
    profile,
  };
}

export default useCheckoutProfile;
