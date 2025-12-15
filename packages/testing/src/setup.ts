/**
 * Global Test Setup
 * Configures test environment and global mocks
 */

import { beforeAll, afterEach, afterAll, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Mock IntersectionObserver
class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

// Setup before all tests
beforeAll(() => {
  // Apply global mocks
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });
  Object.defineProperty(window, "matchMedia", { value: matchMediaMock });
  Object.defineProperty(window, "ResizeObserver", { value: ResizeObserverMock });
  Object.defineProperty(window, "IntersectionObserver", { value: IntersectionObserverMock });

  // Mock scrollTo
  window.scrollTo = vi.fn();

  // Mock fetch if not already available
  if (!globalThis.fetch) {
    globalThis.fetch = vi.fn();
  }
});

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks();
});

// Export mocks for direct use in tests
export {
  localStorageMock,
  sessionStorageMock,
  matchMediaMock,
  ResizeObserverMock,
  IntersectionObserverMock,
};
