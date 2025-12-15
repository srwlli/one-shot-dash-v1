/**
 * Zustand Store Mocks
 * Mocks for testing Zustand stores
 */

import { vi } from "vitest";

/**
 * Create a mock Zustand store
 */
export function createMockZustandStore<T extends object>(initialState: T) {
  let state = { ...initialState };
  const listeners = new Set<(state: T, prevState: T) => void>();

  const api = {
    getState: () => state,
    getInitialState: () => initialState,
    setState: (
      partial: Partial<T> | ((state: T) => Partial<T>),
      replace?: boolean
    ) => {
      const prevState = state;
      const nextPartial = typeof partial === "function" ? partial(state) : partial;

      if (replace) {
        state = nextPartial as T;
      } else {
        state = { ...state, ...nextPartial };
      }

      listeners.forEach((listener) => listener(state, prevState));
    },
    subscribe: (listener: (state: T, prevState: T) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy: () => {
      listeners.clear();
    },
  };

  // Create the hook
  const useStore = ((selector?: (state: T) => unknown) => {
    return selector ? selector(state) : state;
  }) as UseStore<T>;

  // Attach API methods to the hook
  useStore.getState = api.getState;
  useStore.getInitialState = api.getInitialState;
  useStore.setState = api.setState;
  useStore.subscribe = api.subscribe;
  useStore.destroy = api.destroy;

  return useStore;
}

interface UseStore<T> {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState: () => T;
  getInitialState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  destroy: () => void;
}

/**
 * Mock appStore state
 */
export function createMockAppStore() {
  return createMockZustandStore({
    // State
    isInitialized: false,
    isLoading: false,
    error: null as Error | null,
    version: "1.0.0",

    // Actions
    initialize: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    reset: vi.fn(),
  });
}

/**
 * Mock widgetStore state
 */
export function createMockWidgetStore() {
  return createMockZustandStore({
    // State
    instances: {} as Record<string, unknown>,
    activeWidgetId: null as string | null,

    // Actions
    addWidget: vi.fn(),
    removeWidget: vi.fn(),
    updateWidget: vi.fn(),
    setActiveWidget: vi.fn(),
    getWidget: vi.fn(),
    reset: vi.fn(),
  });
}

/**
 * Mock notificationStore state
 */
export function createMockNotificationStore() {
  return createMockZustandStore({
    // State
    notifications: [] as Array<{ id: string; type: string; message: string }>,

    // Actions
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAll: vi.fn(),
  });
}

/**
 * Mock dataStore state
 */
export function createMockDataStore() {
  return createMockZustandStore({
    // State
    cache: {} as Record<string, unknown>,
    pending: {} as Record<string, boolean>,
    errors: {} as Record<string, Error>,

    // Actions
    setData: vi.fn(),
    getData: vi.fn(),
    invalidate: vi.fn(),
    clearCache: vi.fn(),
  });
}

/**
 * Reset all store mocks
 */
export function resetAllStoreMocks(
  ...stores: Array<{ setState: (state: unknown) => void; getInitialState: () => unknown }>
) {
  stores.forEach((store) => {
    store.setState(store.getInitialState());
  });
}
