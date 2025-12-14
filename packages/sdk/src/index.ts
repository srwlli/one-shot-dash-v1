// Types
export type {
  WidgetManifest,
  WidgetContext,
  WidgetTheme,
  WidgetProps,
  WidgetDefinition,
  WidgetLayoutItem,
  DashboardLayout,
  PlatformCapabilities,
} from "./types";

// Permissions
export type {
  WidgetPermissions,
  StoragePermission,
  NetworkPermission,
  NotificationPermission,
} from "./permissions";
export { DEFAULT_PERMISSIONS, hasPermission } from "./permissions";

// Events
export type {
  WidgetEventType,
  WidgetEventPayload,
  WidgetEvent,
  WidgetMountEvent,
  WidgetUnmountEvent,
  WidgetConfigChangeEvent,
  WidgetThemeChangeEvent,
  WidgetVisibilityChangeEvent,
  WidgetResizeEvent,
  WidgetEventHandler,
  WidgetEventCallbacks,
} from "./events";
export { createEventPayload } from "./events";

// Storage
export type {
  WidgetStorage,
  ObservableWidgetStorage,
  StorageItem,
  StorageSetOptions,
  StorageChangeEvent,
  StorageChangeListener,
  StorageEventType,
} from "./storage";
export { createStorageKey, parseStorageKey } from "./storage";

// Hooks (to be implemented in SDK-002)
export { useWidget, WidgetProvider } from "./useWidget";
export { useWidgetStorage } from "./useWidgetStorage";
export { useWidgetEvents } from "./useWidgetEvents";
