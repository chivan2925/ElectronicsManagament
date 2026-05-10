export const ADMIN_ANALYTICS_SCOPES = Object.freeze({
  activity: "activity",
  bestSellers: "best-sellers",
  customers: "customers",
  dashboard: "dashboard",
  inventory: "inventory",
  revenue: "revenue",
});

export function createAdminMetric({ key, label, tone = "blue", trend = null, value }) {
  return {
    key,
    label,
    tone,
    trend,
    value,
  };
}
