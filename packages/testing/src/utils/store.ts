/**
 * Store Test Utilities
 * Helpers for testing Zustand stores
 */

import { vi } from "vitest";

/**
 * Create a mock store with the given initial state
 */
export function createMockStore<T extends object>(initialState: T) {
  let state = { ...initialState };
  const listeners = new Set<(state: T) => void>();

  const store = {
    getState: () => state,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      const nextPartial = typeof partial === "function" ? partial(state) : partial;
      state = { ...state, ...nextPartial };
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener: (state: T) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy: () => {
      listeners.clear();
    },
    reset: () => {
      state = { ...initialState };
      listeners.forEach((listener) => listener(state));
    },
  };

  return store;
}

/**
 * Reset a Zustand store to its initial state
 * Usage: resetStore(useAppStore)
 */
export function resetStore<T extends { getState: () => object }>(store: T): void {
  const state = store.getState();
  // Look for reset or clear methods on the store
  if ("reset" in state && typeof state.reset === "function") {
    (state.reset as () => void)();
  }
}

/**
 * Wait for store state to match a condition
 */
export async function waitForStoreState<T>(
  store: { getState: () => T; subscribe: (listener: (state: T) => void) => () => void },
  predicate: (state: T) => boolean,
  timeout = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Check immediately
    if (predicate(store.getState())) {
      resolve(store.getState());
      return;
    }

    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error("Timeout waiting for store state"));
    }, timeout);

    const unsubscribe = store.subscribe((state) => {
      if (predicate(state)) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(state);
      }
    });
  });
}

/**
 * Create a spy on store actions
 */
export function spyOnStoreAction<T extends object>(
  store: { getState: () => T },
  actionName: keyof T
) {
  const state = store.getState();
  const original = state[actionName];

  if (typeof original !== "function") {
    throw new Error(`${String(actionName)} is not a function`);
  }

  const spy = vi.fn(original as (...args: unknown[]) => unknown);
  (state as Record<string, unknown>)[actionName as string] = spy;

  return {
    spy,
    restore: () => {
      (state as Record<string, unknown>)[actionName as string] = original;
    },
  };
}

/**
 * Mock persist middleware
 */
export function mockPersistMiddleware() {
  return {
    persist: vi.fn((config) => config),
    createJSONStorage: vi.fn(() => ({
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    })),
  };
}
