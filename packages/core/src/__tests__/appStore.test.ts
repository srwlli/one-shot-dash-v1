/**
 * App Store Tests
 * Tests for global app state management
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../store/appStore";

describe("appStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAppStore.getState().reset();
  });

  describe("initial state", () => {
    it("should have correct initial values", () => {
      const state = useAppStore.getState();

      expect(state.sidebarCollapsed).toBe(false);
      expect(state.currentTenant).toBeNull();
      expect(state.preferences).toEqual({
        dateFormat: "MM/DD/YYYY",
        currency: "USD",
        locale: "en-US",
      });
      expect(state.recentWidgets).toEqual([]);
    });
  });

  describe("toggleSidebar", () => {
    it("should toggle sidebar from false to true", () => {
      expect(useAppStore.getState().sidebarCollapsed).toBe(false);

      useAppStore.getState().toggleSidebar();

      expect(useAppStore.getState().sidebarCollapsed).toBe(true);
    });

    it("should toggle sidebar from true to false", () => {
      useAppStore.getState().setSidebarCollapsed(true);

      useAppStore.getState().toggleSidebar();

      expect(useAppStore.getState().sidebarCollapsed).toBe(false);
    });
  });

  describe("setSidebarCollapsed", () => {
    it("should set sidebar collapsed state", () => {
      useAppStore.getState().setSidebarCollapsed(true);
      expect(useAppStore.getState().sidebarCollapsed).toBe(true);

      useAppStore.getState().setSidebarCollapsed(false);
      expect(useAppStore.getState().sidebarCollapsed).toBe(false);
    });
  });

  describe("setCurrentTenant", () => {
    it("should set current tenant", () => {
      useAppStore.getState().setCurrentTenant("tenant-1");

      expect(useAppStore.getState().currentTenant).toBe("tenant-1");
    });

    it("should allow setting tenant to null", () => {
      useAppStore.getState().setCurrentTenant("tenant-1");
      useAppStore.getState().setCurrentTenant(null);

      expect(useAppStore.getState().currentTenant).toBeNull();
    });
  });

  describe("setPreferences", () => {
    it("should update preferences partially", () => {
      useAppStore.getState().setPreferences({ dateFormat: "DD/MM/YYYY" });

      const prefs = useAppStore.getState().preferences;
      expect(prefs.dateFormat).toBe("DD/MM/YYYY");
      expect(prefs.currency).toBe("USD"); // unchanged
      expect(prefs.locale).toBe("en-US"); // unchanged
    });

    it("should update multiple preferences at once", () => {
      useAppStore.getState().setPreferences({
        dateFormat: "YYYY-MM-DD",
        currency: "EUR",
        locale: "de-DE",
      });

      const prefs = useAppStore.getState().preferences;
      expect(prefs.dateFormat).toBe("YYYY-MM-DD");
      expect(prefs.currency).toBe("EUR");
      expect(prefs.locale).toBe("de-DE");
    });
  });

  describe("addRecentWidget", () => {
    it("should add widget to recent list", () => {
      useAppStore.getState().addRecentWidget("widget-1");

      expect(useAppStore.getState().recentWidgets).toEqual(["widget-1"]);
    });

    it("should add new widget at the beginning", () => {
      useAppStore.getState().addRecentWidget("widget-1");
      useAppStore.getState().addRecentWidget("widget-2");

      expect(useAppStore.getState().recentWidgets).toEqual(["widget-2", "widget-1"]);
    });

    it("should move existing widget to the beginning", () => {
      useAppStore.getState().addRecentWidget("widget-1");
      useAppStore.getState().addRecentWidget("widget-2");
      useAppStore.getState().addRecentWidget("widget-1"); // add widget-1 again

      expect(useAppStore.getState().recentWidgets).toEqual(["widget-1", "widget-2"]);
    });

    it("should limit recent widgets to max 10", () => {
      for (let i = 0; i < 15; i++) {
        useAppStore.getState().addRecentWidget(`widget-${i}`);
      }

      expect(useAppStore.getState().recentWidgets.length).toBe(10);
      expect(useAppStore.getState().recentWidgets[0]).toBe("widget-14");
    });
  });

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      // Make changes
      useAppStore.getState().setSidebarCollapsed(true);
      useAppStore.getState().setCurrentTenant("tenant-1");
      useAppStore.getState().setPreferences({ currency: "EUR" });
      useAppStore.getState().addRecentWidget("widget-1");

      // Reset
      useAppStore.getState().reset();

      // Verify reset
      const state = useAppStore.getState();
      expect(state.sidebarCollapsed).toBe(false);
      expect(state.currentTenant).toBeNull();
      expect(state.preferences.currency).toBe("USD");
      expect(state.recentWidgets).toEqual([]);
    });
  });
});
