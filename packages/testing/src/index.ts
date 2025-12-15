/**
 * @platform/testing
 * Shared testing utilities for the Business Dashboard Platform
 */

// Re-export testing libraries
export { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Re-export vitest utilities
export { vi, describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "vitest";

// Export setup mocks
export {
  localStorageMock,
  sessionStorageMock,
  matchMediaMock,
  ResizeObserverMock,
  IntersectionObserverMock,
} from "./setup";

// Export custom utilities
export * from "./utils/render";
export * from "./utils/store";

// Export mocks
export * from "./mocks";
