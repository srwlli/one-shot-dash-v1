// Platform
export {
  PlatformProvider,
  usePlatform,
  useTheme,
  usePlatformCapabilities,
  type PlatformProviderProps,
  type PlatformContextValue,
} from "./platform/PlatformProvider";

export {
  isElectron,
  isWeb,
  isPWA,
  detectCapabilities,
  getPlatformName,
  hasFileSystemAccess,
  hasNotifications,
  hasOfflineSupport,
} from "./platform/capabilities";

// Dashboard
export {
  WidgetRegistry,
  createWidgetRegistry,
  type WidgetEntry,
} from "./dashboard/WidgetRegistry";

export {
  LayoutEngine,
  EmptyLayout,
  type LayoutEngineProps,
} from "./dashboard/LayoutEngine";

export {
  Dashboard,
  DashboardSkeleton,
  type DashboardProps,
} from "./dashboard/Dashboard";

// Store
export {
  // App Store
  useAppStore,
  type AppState,
  type AppActions,
  type AppStore,
  type UserPreferences,
  // Widget Store
  useWidgetStore,
  selectWidgetInstance,
  selectWidgetLoading,
  selectAllWidgetIds,
  type WidgetState,
  type WidgetActions,
  type WidgetStore,
  type WidgetInstance,
  type WidgetLoadingState,
  // Notification Store
  useNotificationStore,
  toast,
  type NotificationState,
  type NotificationActions,
  type NotificationStore,
  type Toast,
  type ToastVariant,
  // Data Store
  useDataStore,
  selectCacheEntry,
  selectRequestState,
  selectError,
  type DataState,
  type DataActions,
  type DataStore,
  type CacheEntry,
  type RequestState,
} from "./store";
