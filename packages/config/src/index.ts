// Schema types and utilities
export type {
  LayoutConfig,
  WidgetPosition,
  TenantConfig,
  AppConfig,
} from "./schema";

export {
  generateInstanceId,
  normalizeLayout,
  validateLayout,
  validateTenant,
} from "./schema";

// Default configurations
import dashboardLayout from "./layouts/dashboard.json";
import defaultTenant from "./tenants/default.json";

export const layouts = {
  dashboard: dashboardLayout,
} as const;

export const tenants = {
  default: defaultTenant,
} as const;

/**
 * Get a layout by ID
 */
export function getLayout(id: string): typeof dashboardLayout | undefined {
  const layoutMap: Record<string, typeof dashboardLayout> = {
    "main-dashboard": dashboardLayout,
  };
  return layoutMap[id];
}

/**
 * Get a tenant by ID
 */
export function getTenant(id: string): typeof defaultTenant | undefined {
  const tenantMap: Record<string, typeof defaultTenant> = {
    default: defaultTenant,
  };
  return tenantMap[id];
}

/**
 * Get default layout
 */
export function getDefaultLayout(): typeof dashboardLayout {
  return dashboardLayout;
}

/**
 * Get default tenant
 */
export function getDefaultTenant(): typeof defaultTenant {
  return defaultTenant;
}
