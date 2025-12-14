"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useWidget } from "./useWidget";
import type { WidgetStorage, StorageSetOptions } from "./storage";
import { createStorageKey } from "./storage";

/**
 * In-memory storage fallback
 */
const memoryStorage = new Map<string, string>();

/**
 * Get storage backend based on availability
 */
function getStorageBackend(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    // Test if localStorage is available
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return localStorage;
  } catch {
    // localStorage not available (private browsing, etc.)
    return null;
  }
}

/**
 * Create a storage implementation for a widget
 */
function createWidgetStorage(widgetId: string): WidgetStorage {
  const storage = getStorageBackend();

  const getFullKey = (key: string) => createStorageKey(widgetId, key);

  return {
    async get<T>(key: string): Promise<T | undefined> {
      const fullKey = getFullKey(key);

      try {
        const raw = storage
          ? storage.getItem(fullKey)
          : memoryStorage.get(fullKey);

        if (!raw) return undefined;

        const item = JSON.parse(raw);

        // Check expiration
        if (item.expiresAt && Date.now() > item.expiresAt) {
          await this.remove(key);
          return undefined;
        }

        return item.value as T;
      } catch {
        return undefined;
      }
    },

    async set<T>(key: string, value: T, options?: StorageSetOptions): Promise<void> {
      const fullKey = getFullKey(key);
      const now = Date.now();

      const item = {
        value,
        createdAt: now,
        updatedAt: now,
        expiresAt: options?.ttl ? now + options.ttl : undefined,
      };

      const raw = JSON.stringify(item);

      if (storage) {
        storage.setItem(fullKey, raw);
      } else {
        memoryStorage.set(fullKey, raw);
      }
    },

    async remove(key: string): Promise<void> {
      const fullKey = getFullKey(key);

      if (storage) {
        storage.removeItem(fullKey);
      } else {
        memoryStorage.delete(fullKey);
      }
    },

    async has(key: string): Promise<boolean> {
      const value = await this.get(key);
      return value !== undefined;
    },

    async keys(): Promise<string[]> {
      const prefix = `widget:${widgetId}:`;
      const keys: string[] = [];

      if (storage) {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key?.startsWith(prefix)) {
            keys.push(key.slice(prefix.length));
          }
        }
      } else {
        for (const key of memoryStorage.keys()) {
          if (key.startsWith(prefix)) {
            keys.push(key.slice(prefix.length));
          }
        }
      }

      return keys;
    },

    async clear(): Promise<void> {
      const allKeys = await this.keys();
      await Promise.all(allKeys.map((key) => this.remove(key)));
    },
  };
}

/**
 * Return type for useWidgetStorage hook
 */
export interface UseWidgetStorageReturn<T> {
  /** Current stored value */
  value: T | undefined;
  /** Loading state */
  loading: boolean;
  /** Error if storage operation failed */
  error: Error | null;
  /** Set the stored value */
  setValue: (value: T, options?: StorageSetOptions) => Promise<void>;
  /** Remove the stored value */
  remove: () => Promise<void>;
  /** Refresh value from storage */
  refresh: () => Promise<void>;
}

/**
 * Hook to access widget-scoped storage for a specific key
 */
export function useWidgetStorage<T = unknown>(
  key: string,
  defaultValue?: T
): UseWidgetStorageReturn<T> {
  const { manifest } = useWidget();
  const [value, setValueState] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const storage = useMemo(
    () => createWidgetStorage(manifest.id),
    [manifest.id]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stored = await storage.get<T>(key);
      setValueState(stored ?? defaultValue);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Storage error"));
    } finally {
      setLoading(false);
    }
  }, [storage, key, defaultValue]);

  const setValue = useCallback(
    async (newValue: T, options?: StorageSetOptions) => {
      setError(null);

      try {
        await storage.set(key, newValue, options);
        setValueState(newValue);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Storage error"));
        throw e;
      }
    },
    [storage, key]
  );

  const remove = useCallback(async () => {
    setError(null);

    try {
      await storage.remove(key);
      setValueState(defaultValue);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Storage error"));
      throw e;
    }
  }, [storage, key, defaultValue]);

  // Load initial value
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    value,
    loading,
    error,
    setValue,
    remove,
    refresh,
  };
}

/**
 * Hook to get the full storage interface for advanced use cases
 */
export function useWidgetStorageInterface(): WidgetStorage {
  const { manifest } = useWidget();

  return useMemo(() => createWidgetStorage(manifest.id), [manifest.id]);
}
