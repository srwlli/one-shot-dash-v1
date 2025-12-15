/**
 * useWebSocket Hook Tests
 * Tests for WebSocket real-time data
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useWebSocket } from "../data/useWebSocket";

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  protocols?: string | string[];
  readyState = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  send = vi.fn();
  close = vi.fn();

  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
    MockWebSocket.instances.push(this);

    // Auto-open after a tick
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.(new Event("open"));
    }, 0);
  }

  // Helpers for testing
  simulateMessage(data: unknown) {
    const eventData = typeof data === "string" ? data : JSON.stringify(data);
    this.onmessage?.(new MessageEvent("message", { data: eventData }));
  }

  simulateClose(code = 1000, reason = "", wasClean = true) {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent("close", { code, reason, wasClean }));
  }

  simulateError() {
    this.onerror?.(new Event("error"));
  }

  static instances: MockWebSocket[] = [];
  static getLastInstance() {
    return MockWebSocket.instances[MockWebSocket.instances.length - 1];
  }
  static clearInstances() {
    MockWebSocket.instances = [];
  }
}

describe("useWebSocket", () => {
  beforeEach(() => {
    vi.stubGlobal("WebSocket", MockWebSocket);
    MockWebSocket.clearInstances();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should start with idle status when connectOnMount is false", () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { connectOnMount: false })
      );

      expect(result.current.status).toBe("idle");
      expect(result.current.isConnected).toBe(false);
      expect(result.current.lastMessage).toBeUndefined();
      expect(result.current.messages).toEqual([]);
    });
  });

  describe("connection", () => {
    it("should connect on mount by default", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" })
      );

      expect(result.current.status).toBe("connecting");

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.status).toBe("connected");
      expect(result.current.isConnected).toBe(true);
    });

    it("should create WebSocket with correct URL", async () => {
      renderHook(() => useWebSocket({ url: "wss://example.com/ws" }));

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();
      expect(ws.url).toBe("wss://example.com/ws");
    });

    it("should pass protocols to WebSocket", async () => {
      renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws", protocols: ["graphql-ws"] })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();
      expect(ws.protocols).toEqual(["graphql-ws"]);
    });

    it("should call onOpen callback", async () => {
      const onOpen = vi.fn();

      renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { onOpen })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      expect(onOpen).toHaveBeenCalled();
    });
  });

  describe("messages", () => {
    it("should receive JSON messages", async () => {
      const onMessage = vi.fn();

      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { onMessage })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();
      const message = { type: "update", data: { value: 42 } };

      act(() => {
        ws.simulateMessage(message);
      });

      expect(result.current.lastMessage).toEqual(message);
      expect(result.current.messages[0]).toEqual(message);
      expect(onMessage).toHaveBeenCalledWith(message);
    });

    it("should receive raw message data", async () => {
      const { result } = renderHook(() =>
        useWebSocket<{ value: number }>({ url: "wss://example.com/ws" })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        ws.simulateMessage({ value: 42 });
      });

      // The message is parsed from JSON
      expect(result.current.lastMessage).toEqual({ value: 42 });
    });

    it("should maintain message buffer", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      // Add multiple messages
      act(() => {
        for (let i = 0; i < 5; i++) {
          ws.simulateMessage({ id: i });
        }
      });

      expect(result.current.messages.length).toBe(5);
      // Newest message first
      expect(result.current.messages[0]).toEqual({ id: 4 });
    });
  });

  describe("send", () => {
    it("should send string message", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        result.current.send("hello");
      });

      expect(ws.send).toHaveBeenCalledWith("hello");
    });

    it("should send JSON message", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        result.current.sendJson({ type: "subscribe", channel: "updates" });
      });

      // sendJson calls send with JSON.stringify, which then calls ws.send with JSON.stringify again
      expect(ws.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "subscribe", channel: "updates" })
      );
    });

    it("should not send when not connected", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { connectOnMount: false })
      );

      act(() => {
        result.current.send("test");
      });

      // Should not throw, but also shouldn't send
      expect(MockWebSocket.instances.length).toBe(0);
    });
  });

  describe("disconnect", () => {
    it("should disconnect when called", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        result.current.disconnect();
      });

      expect(ws.close).toHaveBeenCalledWith(1000, "Client disconnect");
      expect(result.current.status).toBe("disconnected");
    });

    it("should call onClose callback", async () => {
      const onClose = vi.fn();

      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { onClose })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        ws.simulateClose();
      });

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("reconnection", () => {
    it("should reconnect on unclean close when enabled", async () => {
      renderHook(() =>
        useWebSocket({
          url: "wss://example.com/ws",
          reconnect: true,
          reconnectDelay: 1000,
        })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        ws.simulateClose(1006, "Connection lost", false);
      });

      expect(MockWebSocket.instances.length).toBe(1);

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should have created a new WebSocket
      expect(MockWebSocket.instances.length).toBe(2);
    });

    it("should handle clean close without reconnecting", async () => {
      MockWebSocket.clearInstances();

      const { result } = renderHook(() =>
        useWebSocket({
          url: "wss://example.com/ws",
          reconnect: true,
          reconnectDelay: 100,
        })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.status).toBe("connected");
      const ws = MockWebSocket.getLastInstance();

      act(() => {
        ws.simulateClose(1000, "Normal closure", true);
      });

      expect(result.current.status).toBe("disconnected");
    });

    it("should respect maxReconnectAttempts", async () => {
      renderHook(() =>
        useWebSocket({
          url: "wss://example.com/ws",
          reconnect: true,
          maxReconnectAttempts: 2,
          reconnectDelay: 100,
        })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      // First connection
      let ws = MockWebSocket.getLastInstance();
      act(() => {
        ws.simulateClose(1006, "Error", false);
      });

      // First reconnect
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      ws = MockWebSocket.getLastInstance();
      act(() => {
        ws.readyState = MockWebSocket.OPEN;
        ws.onopen?.(new Event("open"));
        ws.simulateClose(1006, "Error", false);
      });

      // Second reconnect
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      ws = MockWebSocket.getLastInstance();
      act(() => {
        ws.readyState = MockWebSocket.OPEN;
        ws.onopen?.(new Event("open"));
        ws.simulateClose(1006, "Error", false);
      });

      // Should not reconnect (max attempts reached)
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(MockWebSocket.instances.length).toBe(3); // Initial + 2 reconnects
    });
  });

  describe("error handling", () => {
    it("should handle connection error", async () => {
      const onError = vi.fn();

      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { onError })
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      const ws = MockWebSocket.getLastInstance();

      act(() => {
        ws.simulateError();
      });

      expect(result.current.status).toBe("error");
      expect(onError).toHaveBeenCalled();
    });
  });

  describe("manual connect", () => {
    it("should allow manual connection", async () => {
      const { result } = renderHook(() =>
        useWebSocket({ url: "wss://example.com/ws" }, { connectOnMount: false })
      );

      expect(MockWebSocket.instances.length).toBe(0);

      act(() => {
        result.current.connect();
      });

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      expect(MockWebSocket.instances.length).toBe(1);
      expect(result.current.isConnected).toBe(true);
    });
  });
});
