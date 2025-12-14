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
