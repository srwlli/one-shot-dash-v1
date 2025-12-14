"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  type ComponentType,
} from "react";
import type { WidgetContext, WidgetManifest, WidgetTheme, PlatformCapabilities } from "./types";

/**
 * Default platform capabilities (web browser)
 */
const DEFAULT_CAPABILITIES: PlatformCapabilities = {
  isElectron: false,
  isWeb: true,
  isPWA: false,
  features: {
    fileSystem: false,
    notifications: "Notification" in globalThis,
    systemTray: false,
    offline: "serviceWorker" in navigator,
  },
};

/**
 * Default theme
 */
const DEFAULT_THEME: WidgetTheme = {
  mode: "system",
  resolved: "light",
};

/**
 * Widget context for React
 */
const WidgetContextReact = createContext<WidgetContext | null>(null);

/**
 * Props for WidgetProvider
 */
export interface WidgetProviderProps {
  /** Widget manifest */
  manifest: WidgetManifest;
  /** Widget configuration */
  config?: Record<string, unknown>;
  /** Theme information */
  theme?: WidgetTheme;
  /** Platform capabilities */
  capabilities?: PlatformCapabilities;
  /** Tenant ID for multi-tenant apps */
  tenantId?: string;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component that supplies widget context
 */
export function WidgetProvider({
  manifest,
  config = {},
  theme = DEFAULT_THEME,
  capabilities = DEFAULT_CAPABILITIES,
  tenantId,
  children,
}: WidgetProviderProps): ReactNode {
  const contextValue: WidgetContext = {
    manifest,
    config: { ...manifest.defaultConfig, ...config },
    theme,
    capabilities,
    tenantId,
  };

  return (
    <WidgetContextReact.Provider value={contextValue}>
      {children}
    </WidgetContextReact.Provider>
  );
}

/**
 * Hook to access widget context
 * @throws Error if used outside of WidgetProvider
 */
export function useWidget(): WidgetContext {
  const context = useContext(WidgetContextReact);

  if (!context) {
    throw new Error(
      "useWidget must be used within a WidgetProvider. " +
        "Make sure your widget is wrapped with WidgetProvider."
    );
  }

  return context;
}

/**
 * Hook to access just the widget config
 */
export function useWidgetConfig<T extends Record<string, unknown> = Record<string, unknown>>(): T {
  const { config } = useWidget();
  return config as T;
}

/**
 * Hook to access just the theme
 */
export function useWidgetTheme(): WidgetTheme {
  const { theme } = useWidget();
  return theme;
}

/**
 * Hook to access platform capabilities
 */
export function useCapabilities(): PlatformCapabilities {
  const { capabilities } = useWidget();
  return capabilities;
}

/**
 * HOC to wrap a widget component with WidgetProvider
 */
export function withWidgetContext<P extends object>(
  WrappedComponent: ComponentType<P>,
  manifest: WidgetManifest
): ComponentType<P & { config?: Record<string, unknown> }> {
  const WithWidgetContext = (props: P & { config?: Record<string, unknown> }) => {
    const { config, ...rest } = props;
    return (
      <WidgetProvider manifest={manifest} config={config}>
        <WrappedComponent {...(rest as P)} />
      </WidgetProvider>
    );
  };

  WithWidgetContext.displayName = `WithWidgetContext(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithWidgetContext;
}
