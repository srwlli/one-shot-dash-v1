/**
 * Store exports for @platform/core
 * Zustand-based state management
 */

// Types
export type {
  // App Store
  AppState,
  AppActions,
  AppStore,
  UserPreferences,
  // Widget Store
  WidgetState,
  WidgetActions,
  WidgetStore,
  WidgetInstance,
  WidgetLoadingState,
  // Notification Store
  NotificationState,
  NotificationActions,
  NotificationStore,
  Toast,
  ToastVariant,
  // Data Store
  DataState,
  DataActions,
  DataStore,
  CacheEntry,
  RequestState,
} from "./types";

// App Store
export { useAppStore } from "./appStore";

// Widget Store
export {
  useWidgetStore,
  selectWidgetInstance,
  selectWidgetLoading,
  selectAllWidgetIds,
} from "./widgetStore";

// Notification Store
export { useNotificationStore, toast } from "./notificationStore";

// Data Store
export {
  useDataStore,
  selectCacheEntry,
  selectRequestState,
  selectError,
} from "./dataStore";
