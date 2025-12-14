import type { PlatformCapabilities } from "@platform/sdk";

/**
 * Detect if running in Electron
 */
export function isElectron(): boolean {
  if (typeof window === "undefined") return false;

  // Check for Electron-specific globals
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("electron")) return true;

  // Check for window.electronAPI (from preload)
  if ("electronAPI" in window) return true;

  // Check for process.versions.electron
  if (
    typeof process !== "undefined" &&
    process.versions &&
    "electron" in process.versions
  ) {
    return true;
  }

  return false;
}

/**
 * Detect if running as installed PWA
 */
export function isPWA(): boolean {
  if (typeof window === "undefined") return false;

  // Check display-mode media query
  if (window.matchMedia("(display-mode: standalone)").matches) return true;

  // iOS Safari specific check
  if ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone) {
    return true;
  }

  return false;
}

/**
 * Detect if running in web browser (not Electron, not PWA)
 */
export function isWeb(): boolean {
  return !isElectron() && !isPWA();
}

/**
 * Check if file system access is available
 */
export function hasFileSystemAccess(): boolean {
  if (isElectron()) return true;
  return "showOpenFilePicker" in window;
}

/**
 * Check if notifications are available
 */
export function hasNotifications(): boolean {
  return "Notification" in globalThis;
}

/**
 * Check if service worker is available (for offline support)
 */
export function hasOfflineSupport(): boolean {
  return "serviceWorker" in navigator;
}

/**
 * Get current platform capabilities
 */
export function detectCapabilities(): PlatformCapabilities {
  const electronMode = isElectron();
  const pwaMode = isPWA();

  return {
    isElectron: electronMode,
    isWeb: !electronMode && !pwaMode,
    isPWA: pwaMode,
    features: {
      fileSystem: hasFileSystemAccess(),
      notifications: hasNotifications(),
      systemTray: electronMode,
      offline: hasOfflineSupport(),
    },
  };
}

/**
 * Get platform name for display
 */
export function getPlatformName(): string {
  if (isElectron()) return "Desktop";
  if (isPWA()) return "App";
  return "Web";
}
