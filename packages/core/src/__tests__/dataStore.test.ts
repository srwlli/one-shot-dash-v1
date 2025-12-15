/**
 * Data Store Tests
 * Tests for data caching and request state management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  useDataStore,
  selectCacheEntry,
  selectRequestState,
  selectError,
} from "../store/dataStore";

describe("dataStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useDataStore.getState().clearCache();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should have empty cache", () => {
      const state = useDataStore.getState();

      expect(state.cache).toEqual({});
      expect(state.requestStates).toEqual({});
      expect(state.errors).toEqual({});
    });
  });

  describe("setCache", () => {
    it("should set cache entry", () => {
      const data = { users: [{ id: 1, name: "Test" }] };

      useDataStore.getState().setCache("users", data);

      const entry = useDataStore.getState().cache["users"];
      expect(entry).toBeDefined();
      expect(entry.data).toEqual(data);
      expect(entry.key).toBe("users");
    });

    it("should set request state to success", () => {
      useDataStore.getState().setCache("users", { data: "test" });

      expect(useDataStore.getState().requestStates["users"]).toBe("success");
    });

    it("should clear any previous error", () => {
      useDataStore.getState().setRequestState("users", "error", "Previous error");
      useDataStore.getState().setCache("users", { data: "test" });

      expect(useDataStore.getState().errors["users"]).toBeNull();
    });

    it("should use default TTL of 5 minutes", () => {
      const now = Date.now();
      vi.setSystemTime(now);

      useDataStore.getState().setCache("users", { data: "test" });

      const entry = useDataStore.getState().cache["users"];
      expect(entry.ttl).toBe(5 * 60 * 1000);
      expect(entry.cachedAt).toBe(now);
    });

    it("should allow custom TTL", () => {
      const customTtl = 60 * 1000; // 1 minute
      useDataStore.getState().setCache("users", { data: "test" }, customTtl);

      expect(useDataStore.getState().cache["users"].ttl).toBe(customTtl);
    });
  });

  describe("getCache", () => {
    it("should return cached data", () => {
      const data = { users: ["user1", "user2"] };
      useDataStore.getState().setCache("users", data);

      const cached = useDataStore.getState().getCache<typeof data>("users");

      expect(cached).toEqual(data);
    });

    it("should return undefined for non-existent key", () => {
      const cached = useDataStore.getState().getCache("non-existent");

      expect(cached).toBeUndefined();
    });

    it("should return undefined for expired cache", () => {
      const now = Date.now();
      vi.setSystemTime(now);

      useDataStore.getState().setCache("users", { data: "test" }, 1000);

      // Advance past TTL
      vi.setSystemTime(now + 2000);

      const cached = useDataStore.getState().getCache("users");

      expect(cached).toBeUndefined();
    });

    it("should invalidate expired cache on access", () => {
      const now = Date.now();
      vi.setSystemTime(now);

      useDataStore.getState().setCache("users", { data: "test" }, 1000);

      vi.setSystemTime(now + 2000);
      useDataStore.getState().getCache("users");

      expect(useDataStore.getState().cache["users"]).toBeUndefined();
    });
  });

  describe("invalidateCache", () => {
    it("should remove cache entry", () => {
      useDataStore.getState().setCache("users", { data: "test" });

      useDataStore.getState().invalidateCache("users");

      expect(useDataStore.getState().cache["users"]).toBeUndefined();
    });

    it("should remove request state", () => {
      useDataStore.getState().setCache("users", { data: "test" });

      useDataStore.getState().invalidateCache("users");

      expect(useDataStore.getState().requestStates["users"]).toBeUndefined();
    });

    it("should remove error", () => {
      useDataStore.getState().setRequestState("users", "error", "Error");

      useDataStore.getState().invalidateCache("users");

      expect(useDataStore.getState().errors["users"]).toBeUndefined();
    });

    it("should handle non-existent key", () => {
      // Should not throw
      useDataStore.getState().invalidateCache("non-existent");
    });
  });

  describe("clearCache", () => {
    it("should clear all cache entries", () => {
      useDataStore.getState().setCache("users", { data: "users" });
      useDataStore.getState().setCache("posts", { data: "posts" });

      useDataStore.getState().clearCache();

      expect(useDataStore.getState().cache).toEqual({});
      expect(useDataStore.getState().requestStates).toEqual({});
      expect(useDataStore.getState().errors).toEqual({});
    });
  });

  describe("setRequestState", () => {
    it("should set request state to pending", () => {
      useDataStore.getState().setRequestState("users", "pending");

      expect(useDataStore.getState().requestStates["users"]).toBe("pending");
    });

    it("should set error state with message", () => {
      useDataStore.getState().setRequestState("users", "error", "Network error");

      expect(useDataStore.getState().requestStates["users"]).toBe("error");
      expect(useDataStore.getState().errors["users"]).toBe("Network error");
    });

    it("should clear error when setting non-error state", () => {
      useDataStore.getState().setRequestState("users", "error", "Error");
      useDataStore.getState().setRequestState("users", "success");

      expect(useDataStore.getState().errors["users"]).toBeNull();
    });
  });

  describe("isCacheValid", () => {
    it("should return true for valid cache", () => {
      useDataStore.getState().setCache("users", { data: "test" });

      expect(useDataStore.getState().isCacheValid("users")).toBe(true);
    });

    it("should return false for non-existent key", () => {
      expect(useDataStore.getState().isCacheValid("non-existent")).toBe(false);
    });

    it("should return false for expired cache", () => {
      const now = Date.now();
      vi.setSystemTime(now);

      useDataStore.getState().setCache("users", { data: "test" }, 1000);

      vi.setSystemTime(now + 2000);

      expect(useDataStore.getState().isCacheValid("users")).toBe(false);
    });

    it("should return true at exact TTL boundary", () => {
      const now = Date.now();
      vi.setSystemTime(now);

      useDataStore.getState().setCache("users", { data: "test" }, 1000);

      vi.setSystemTime(now + 1000);

      expect(useDataStore.getState().isCacheValid("users")).toBe(true);
    });
  });

  describe("selectors", () => {
    beforeEach(() => {
      useDataStore.getState().setCache("users", { name: "Test" });
      useDataStore.getState().setRequestState("posts", "error", "Failed to load");
    });

    it("selectCacheEntry should return cached data", () => {
      const data = selectCacheEntry<{ name: string }>("users")(useDataStore.getState());

      expect(data).toEqual({ name: "Test" });
    });

    it("selectCacheEntry should return undefined for non-existent", () => {
      const data = selectCacheEntry("non-existent")(useDataStore.getState());

      expect(data).toBeUndefined();
    });

    it("selectRequestState should return state", () => {
      const state = selectRequestState("users")(useDataStore.getState());

      expect(state).toBe("success");
    });

    it("selectRequestState should return idle for non-existent", () => {
      const state = selectRequestState("non-existent")(useDataStore.getState());

      expect(state).toBe("idle");
    });

    it("selectError should return error", () => {
      const error = selectError("posts")(useDataStore.getState());

      expect(error).toBe("Failed to load");
    });

    it("selectError should return null for non-existent", () => {
      const error = selectError("non-existent")(useDataStore.getState());

      expect(error).toBeNull();
    });
  });
});
