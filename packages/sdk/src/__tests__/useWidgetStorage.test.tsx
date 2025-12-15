/**
 * useWidgetStorage Hook Tests
 * Tests for widget-scoped storage
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { WidgetProvider } from "../useWidget";
import { useWidgetStorage, useWidgetStorageInterface } from "../useWidgetStorage";
import type { WidgetManifest } from "../types";

// Mock manifest
const mockManifest: WidgetManifest = {
  id: "storage-test-widget",
  name: "Storage Test Widget",
  version: "1.0.0",
  description: "A test widget for storage",
  author: "Test Author",
  category: "utilities",
  icon: "test-icon",
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 1, height: 1 },
  maxSize: { width: 4, height: 4 },
};

// Wrapper component
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <WidgetProvider manifest={mockManifest}>
        {children}
      </WidgetProvider>
    );
  };
}

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

describe("useWidgetStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return initial loading state", async () => {
    const { result } = renderHook(() => useWidgetStorage("testKey"), {
      wrapper: createWrapper(),
    });

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.value).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should return default value when no stored value", async () => {
    const { result } = renderHook(
      () => useWidgetStorage("testKey", "defaultValue"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe("defaultValue");
  });

  it("should set and retrieve value", async () => {
    const { result } = renderHook(
      () => useWidgetStorage<string>("testKey"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setValue("newValue");
    });

    expect(result.current.value).toBe("newValue");
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it("should remove value", async () => {
    const { result } = renderHook(
      () => useWidgetStorage<string>("testKey", "default"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setValue("storedValue");
    });

    expect(result.current.value).toBe("storedValue");

    await act(async () => {
      await result.current.remove();
    });

    expect(result.current.value).toBe("default");
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it("should refresh value from storage", async () => {
    const { result } = renderHook(
      () => useWidgetStorage<string>("testKey"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setValue("initialValue");
    });

    // Simulate external change to storage
    const storageKey = `widget:${mockManifest.id}:testKey`;
    localStorageMock.setItem(
      storageKey,
      JSON.stringify({ value: "externalValue", createdAt: Date.now(), updatedAt: Date.now() })
    );

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.value).toBe("externalValue");
  });

  it("should handle complex objects", async () => {
    const { result } = renderHook(
      () => useWidgetStorage<{ name: string; count: number }>("testKey"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const complexValue = { name: "test", count: 42 };

    await act(async () => {
      await result.current.setValue(complexValue);
    });

    expect(result.current.value).toEqual(complexValue);
  });

  it("should handle TTL option", async () => {
    const { result } = renderHook(
      () => useWidgetStorage<string>("testKey"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Set a value with very short TTL
    await act(async () => {
      await result.current.setValue("tempValue", { ttl: 50 });
    });

    expect(result.current.value).toBe("tempValue");

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 100));

    await act(async () => {
      await result.current.refresh();
    });

    // Value should be undefined after TTL expires
    expect(result.current.value).toBeUndefined();
  });
});

describe("useWidgetStorageInterface", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return storage interface", () => {
    const { result } = renderHook(() => useWidgetStorageInterface(), {
      wrapper: createWrapper(),
    });

    expect(result.current.get).toBeDefined();
    expect(result.current.set).toBeDefined();
    expect(result.current.remove).toBeDefined();
    expect(result.current.has).toBeDefined();
    expect(result.current.keys).toBeDefined();
    expect(result.current.clear).toBeDefined();
  });

  it("should scope keys to widget", async () => {
    const { result } = renderHook(() => useWidgetStorageInterface(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.set("myKey", "myValue");
    });

    const expectedKey = `widget:${mockManifest.id}:myKey`;
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      expectedKey,
      expect.any(String)
    );
  });

  it("should get keys for widget", async () => {
    const { result } = renderHook(() => useWidgetStorageInterface(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.set("key1", "value1");
      await result.current.set("key2", "value2");
    });

    const keys = await result.current.keys();

    expect(keys).toContain("key1");
    expect(keys).toContain("key2");
  });

  it("should check if key exists", async () => {
    const { result } = renderHook(() => useWidgetStorageInterface(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.set("existingKey", "value");
    });

    const exists = await result.current.has("existingKey");
    const notExists = await result.current.has("nonExistentKey");

    expect(exists).toBe(true);
    expect(notExists).toBe(false);
  });

  it("should clear all widget keys", async () => {
    const { result } = renderHook(() => useWidgetStorageInterface(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.set("key1", "value1");
      await result.current.set("key2", "value2");
    });

    await act(async () => {
      await result.current.clear();
    });

    const keys = await result.current.keys();
    expect(keys).toHaveLength(0);
  });
});
