/**
 * Storage permission levels
 */
export type StoragePermission = "none" | "local" | "sync";

/**
 * Network permission levels
 */
export type NetworkPermission = "none" | "same-origin" | "any";

/**
 * Notification permission levels
 */
export type NotificationPermission = "none" | "basic" | "full";

/**
 * Widget permissions - what a widget is allowed to do
 */
export interface WidgetPermissions {
  /**
   * Storage access level
   * - none: No storage access
   * - local: Local storage only (per-device)
   * - sync: Synced storage (across devices, requires auth)
   */
  storage?: StoragePermission;

  /**
   * Network access level
   * - none: No network access
   * - same-origin: Only same-origin requests
   * - any: Any network requests (requires approval)
   */
  network?: NetworkPermission;

  /**
   * Notification permission
   * - none: No notifications
   * - basic: Simple notifications
   * - full: Rich notifications with actions
   */
  notifications?: NotificationPermission;

  /**
   * Can access clipboard
   */
  clipboard?: boolean;

  /**
   * Can access geolocation
   */
  geolocation?: boolean;

  /**
   * Can access camera/microphone
   */
  media?: boolean;

  /**
   * Custom permissions (for extensibility)
   */
  custom?: Record<string, boolean>;
}

/**
 * Default permissions (most restrictive)
 */
export const DEFAULT_PERMISSIONS: WidgetPermissions = {
  storage: "none",
  network: "none",
  notifications: "none",
  clipboard: false,
  geolocation: false,
  media: false,
};

/**
 * Check if widget has a specific permission
 */
export function hasPermission(
  permissions: WidgetPermissions | undefined,
  permission: keyof WidgetPermissions,
  level?: string
): boolean {
  if (!permissions) return false;

  const value = permissions[permission];

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string" && level) {
    // For tiered permissions, check if current level meets minimum
    const levels: Record<string, string[]> = {
      storage: ["none", "local", "sync"],
      network: ["none", "same-origin", "any"],
      notifications: ["none", "basic", "full"],
    };

    const tierLevels = levels[permission];
    if (tierLevels) {
      const currentIndex = tierLevels.indexOf(value);
      const requiredIndex = tierLevels.indexOf(level);
      return currentIndex >= requiredIndex;
    }
  }

  return value !== "none" && value !== undefined;
}
