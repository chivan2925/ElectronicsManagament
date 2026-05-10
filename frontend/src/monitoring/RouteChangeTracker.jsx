import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { trackRouteChange } from "./errorTracking";

function RouteChangeTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    trackRouteChange({
      navigationType,
      routeKey: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location.hash, location.pathname, location.search, navigationType]);

  return null;
}

export default RouteChangeTracker;
