import { Suspense } from "react";
import { RouteLoadingFallback } from "../guards/RouteGuardState";

const loadingMessages = {
  admin: "Đang tải khu vực quản trị...",
  store: "Đang tải trải nghiệm mua sắm...",
};

function RouteLoadingBoundary({ children, message, surface = "store" }) {
  return (
    <Suspense fallback={<RouteLoadingFallback message={message || loadingMessages[surface] || loadingMessages.store} surface={surface} />}>
      {children}
    </Suspense>
  );
}

export default RouteLoadingBoundary;
