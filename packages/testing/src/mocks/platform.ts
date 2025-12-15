/**
 * Platform Mocks
 * Mocks for platform-specific functionality
 */

import { vi } from "vitest";

/**
 * Mock widget context
 */
export function createMockWidgetContext(overrides: Partial<MockWidgetContext> = {}) {
  return {
    widgetId: "test-widget-1",
    instanceId: "instance-123",
    manifest: {
      id: "test-widget",
      name: "Test Widget",
      version: "1.0.0",
      description: "A test widget",
      author: "Test",
      icon: "test",
      category: "utilities",
      permissions: [],
      defaultSize: { width: 2, height: 2 },
      minSize: { width: 1, height: 1 },
      maxSize: { width: 4, height: 4 },
    },
    settings: {},
    updateSettings: vi.fn(),
    ...overrides,
  };
}

interface MockWidgetContext {
  widgetId: string;
  instanceId: string;
  manifest: {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    icon: string;
    category: string;
    permissions: string[];
    defaultSize: { width: number; height: number };
    minSize: { width: number; height: number };
    maxSize: { width: number; height: number };
  };
  settings: Record<string, unknown>;
  updateSettings: ReturnType<typeof vi.fn>;
}

/**
 * Mock widget storage
 */
export function createMockWidgetStorage<T extends object>(initialData: T = {} as T) {
  let data = { ...initialData };

  return {
    data,
    isLoading: false,
    error: null as Error | null,
    setItem: vi.fn((key: keyof T, value: T[keyof T]) => {
      data = { ...data, [key]: value };
    }),
    getItem: vi.fn((key: keyof T) => data[key]),
    removeItem: vi.fn((key: keyof T) => {
      const { [key]: _, ...rest } = data;
      data = rest as T;
    }),
    clear: vi.fn(() => {
      data = {} as T;
    }),
  };
}

/**
 * Mock platform detection
 */
export function createMockPlatformDetection(platform: "web" | "desktop" = "web") {
  return {
    isWeb: platform === "web",
    isDesktop: platform === "desktop",
    isElectron: platform === "desktop",
    platform,
  };
}

/**
 * Mock Electron API
 */
export function createMockElectronAPI() {
  return {
    fs: {
      readFile: vi.fn().mockResolvedValue({ success: true, content: "" }),
      readBinary: vi.fn().mockResolvedValue({ success: true, data: new ArrayBuffer(0) }),
      writeFile: vi.fn().mockResolvedValue({ success: true }),
      listDirectory: vi.fn().mockResolvedValue({ success: true, files: [] }),
      exists: vi.fn().mockResolvedValue({ success: true, exists: false }),
      watchFile: vi.fn().mockResolvedValue({ success: true }),
      unwatchFile: vi.fn().mockResolvedValue({ success: true }),
      onFileChange: vi.fn().mockReturnValue(() => {}),
    },
    ipc: {
      send: vi.fn(),
      invoke: vi.fn(),
      on: vi.fn().mockReturnValue(() => {}),
    },
  };
}

/**
 * Apply Electron API mock to window
 */
export function mockElectronEnvironment() {
  const electronAPI = createMockElectronAPI();

  Object.defineProperty(window, "electronAPI", {
    value: electronAPI,
    configurable: true,
  });

  return {
    electronAPI,
    cleanup: () => {
      delete (window as { electronAPI?: unknown }).electronAPI;
    },
  };
}

/**
 * Mock widget registry
 */
export function createMockWidgetRegistry() {
  const widgets = new Map<string, unknown>();

  return {
    register: vi.fn((manifest: unknown) => {
      const m = manifest as { id: string };
      widgets.set(m.id, manifest);
    }),
    unregister: vi.fn((id: string) => {
      widgets.delete(id);
    }),
    get: vi.fn((id: string) => widgets.get(id)),
    getAll: vi.fn(() => Array.from(widgets.values())),
    has: vi.fn((id: string) => widgets.has(id)),
    clear: vi.fn(() => widgets.clear()),
  };
}

/**
 * Mock notification service
 */
export function createMockNotificationService() {
  const notifications: Array<{ id: string; type: string; message: string }> = [];

  return {
    success: vi.fn((message: string) => {
      const id = `notif-${Date.now()}`;
      notifications.push({ id, type: "success", message });
      return id;
    }),
    error: vi.fn((message: string) => {
      const id = `notif-${Date.now()}`;
      notifications.push({ id, type: "error", message });
      return id;
    }),
    warning: vi.fn((message: string) => {
      const id = `notif-${Date.now()}`;
      notifications.push({ id, type: "warning", message });
      return id;
    }),
    info: vi.fn((message: string) => {
      const id = `notif-${Date.now()}`;
      notifications.push({ id, type: "info", message });
      return id;
    }),
    dismiss: vi.fn((id: string) => {
      const index = notifications.findIndex((n) => n.id === id);
      if (index > -1) notifications.splice(index, 1);
    }),
    getAll: () => notifications,
    clear: vi.fn(() => {
      notifications.length = 0;
    }),
  };
}
