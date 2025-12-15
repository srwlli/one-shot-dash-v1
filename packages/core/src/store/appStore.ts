/**
 * App Store
 * Global app state: sidebar, preferences, tenant (theme stays in PlatformProvider)
 */

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { AppStore, AppState, UserPreferences } from "./types";

const DEFAULT_PREFERENCES: UserPreferences = {
  dateFormat: "MM/DD/YYYY",
  currency: "USD",
  locale: "en-US",
};

const initialState: AppState = {
  sidebarCollapsed: false,
  currentTenant: null,
  preferences: DEFAULT_PREFERENCES,
  recentWidgets: [],
};

const MAX_RECENT_WIDGETS = 10;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () =>
          set(
            (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            "toggleSidebar"
          ),

        setSidebarCollapsed: (collapsed: boolean) =>
          set({ sidebarCollapsed: collapsed }, false, "setSidebarCollapsed"),

        setCurrentTenant: (tenantId: string | null) =>
          set({ currentTenant: tenantId }, false, "setCurrentTenant"),

        setPreferences: (preferences: Partial<UserPreferences>) =>
          set(
            (state) => ({
              preferences: { ...state.preferences, ...preferences },
            }),
            false,
            "setPreferences"
          ),

        addRecentWidget: (widgetId: string) =>
          set(
            (state) => {
              const filtered = state.recentWidgets.filter((id) => id !== widgetId);
              const updated = [widgetId, ...filtered].slice(0, MAX_RECENT_WIDGETS);
              return { recentWidgets: updated };
            },
            false,
            "addRecentWidget"
          ),

        reset: () => set(initialState, false, "reset"),
      }),
      {
        name: "platform-app-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          preferences: state.preferences,
          recentWidgets: state.recentWidgets,
        }),
      }
    ),
    { name: "AppStore" }
  )
);
