/**
 * React Mocks
 * Common React-related mocks for testing
 */

import { vi } from "vitest";

/**
 * Mock useRouter for Next.js
 */
export function mockNextRouter(overrides: Partial<NextRouterMock> = {}) {
  const router: NextRouterMock = {
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    basePath: "",
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    push: vi.fn().mockResolvedValue(true),
    replace: vi.fn().mockResolvedValue(true),
    reload: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    ...overrides,
  };

  return router;
}

interface NextRouterMock {
  pathname: string;
  route: string;
  query: Record<string, string>;
  asPath: string;
  basePath: string;
  isLocaleDomain: boolean;
  isReady: boolean;
  isPreview: boolean;
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  reload: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  forward: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
  beforePopState: ReturnType<typeof vi.fn>;
  events: {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    emit: ReturnType<typeof vi.fn>;
  };
  isFallback: boolean;
}

/**
 * Mock usePathname for Next.js App Router
 */
export function mockNextPathname(pathname = "/") {
  return vi.fn(() => pathname);
}

/**
 * Mock useSearchParams for Next.js App Router
 */
export function mockNextSearchParams(params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params);
  return vi.fn(() => searchParams);
}

/**
 * Mock fetch with predefined responses
 */
export function mockFetch(responses: MockFetchResponse[] = []) {
  let callIndex = 0;

  return vi.fn().mockImplementation((url: string, options?: RequestInit) => {
    const response = responses[callIndex] || responses[responses.length - 1];
    callIndex++;

    if (!response) {
      return Promise.reject(new Error("No mock response configured"));
    }

    if (response.error) {
      return Promise.reject(response.error);
    }

    return Promise.resolve({
      ok: response.ok ?? true,
      status: response.status ?? 200,
      statusText: response.statusText ?? "OK",
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
      blob: () => Promise.resolve(new Blob([JSON.stringify(response.data)])),
      headers: new Headers(response.headers || {}),
      url,
    });
  });
}

interface MockFetchResponse {
  ok?: boolean;
  status?: number;
  statusText?: string;
  data?: unknown;
  headers?: Record<string, string>;
  error?: Error;
}

/**
 * Mock WebSocket
 */
export function mockWebSocket() {
  const instances: MockWebSocketInstance[] = [];

  class MockWebSocketClass {
    url: string;
    readyState = 0; // CONNECTING
    onopen: ((event: Event) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    send = vi.fn();
    close = vi.fn();

    constructor(url: string) {
      this.url = url;
      instances.push(this);
      // Simulate connection after a tick
      setTimeout(() => {
        this.readyState = 1; // OPEN
        this.onopen?.(new Event("open"));
      }, 0);
    }

    // Test helpers
    simulateMessage(data: unknown) {
      const event = new MessageEvent("message", {
        data: typeof data === "string" ? data : JSON.stringify(data),
      });
      this.onmessage?.(event);
    }

    simulateError(error?: Error) {
      this.onerror?.(new Event("error"));
    }

    simulateClose(code = 1000, reason = "") {
      this.readyState = 3; // CLOSED
      const event = new CloseEvent("close", { code, reason });
      this.onclose?.(event);
    }
  }

  type MockWebSocketInstance = InstanceType<typeof MockWebSocketClass>;

  return {
    WebSocket: MockWebSocketClass,
    instances,
    getLastInstance: () => instances[instances.length - 1],
    clearInstances: () => {
      instances.length = 0;
    },
  };
}
