/**
 * Data Store
 * Data caching: API responses, request states, TTL management
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DataStore, DataState } from "./types";

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

const initialState: DataState = {
  cache: {},
  requestStates: {},
  errors: {},
};

export const useDataStore = create<DataStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCache: <T>(key: string, data: T, ttl = DEFAULT_TTL) =>
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [key]: {
                key,
                data,
                cachedAt: Date.now(),
                ttl,
              },
            },
            requestStates: {
              ...state.requestStates,
              [key]: "success",
            },
            errors: {
              ...state.errors,
              [key]: null,
            },
          }),
          false,
          "setCache"
        ),

      getCache: <T>(key: string): T | undefined => {
        const entry = get().cache[key];
        if (!entry) return undefined;

        // Check if cache is still valid
        const isExpired = Date.now() > entry.cachedAt + entry.ttl;
        if (isExpired) {
          // Invalidate expired cache
          get().invalidateCache(key);
          return undefined;
        }

        return entry.data as T;
      },

      invalidateCache: (key) =>
        set(
          (state) => {
            const { [key]: removed, ...restCache } = state.cache;
            const { [key]: removedState, ...restStates } = state.requestStates;
            const { [key]: removedError, ...restErrors } = state.errors;
            return {
              cache: restCache,
              requestStates: restStates,
              errors: restErrors,
            };
          },
          false,
          "invalidateCache"
        ),

      clearCache: () => set(initialState, false, "clearCache"),

      setRequestState: (key, state, error) =>
        set(
          (prev) => ({
            requestStates: {
              ...prev.requestStates,
              [key]: state,
            },
            errors: {
              ...prev.errors,
              [key]: error ?? null,
            },
          }),
          false,
          "setRequestState"
        ),

      isCacheValid: (key) => {
        const entry = get().cache[key];
        if (!entry) return false;
        return Date.now() <= entry.cachedAt + entry.ttl;
      },
    }),
    { name: "DataStore" }
  )
);

// Selector helpers
export const selectCacheEntry = <T>(key: string) => (state: DataStore) =>
  state.cache[key]?.data as T | undefined;

export const selectRequestState = (key: string) => (state: DataStore) =>
  state.requestStates[key] ?? "idle";

export const selectError = (key: string) => (state: DataStore) =>
  state.errors[key] ?? null;
