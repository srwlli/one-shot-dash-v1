/**
 * Notification Store Tests
 * Tests for toast notifications
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useNotificationStore, toast } from "../store/notificationStore";

describe("notificationStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useNotificationStore.getState().dismissAll();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should have empty toasts array", () => {
      expect(useNotificationStore.getState().toasts).toEqual([]);
    });

    it("should have default maxToasts of 5", () => {
      expect(useNotificationStore.getState().maxToasts).toBe(5);
    });
  });

  describe("addToast", () => {
    it("should add a toast notification", () => {
      const id = useNotificationStore.getState().addToast({
        title: "Test Toast",
        variant: "default",
        duration: 5000,
      });

      const toasts = useNotificationStore.getState().toasts;
      expect(toasts.length).toBe(1);
      expect(toasts[0].id).toBe(id);
      expect(toasts[0].title).toBe("Test Toast");
      expect(toasts[0].variant).toBe("default");
    });

    it("should add toast with description", () => {
      useNotificationStore.getState().addToast({
        title: "Title",
        description: "Description",
        variant: "info",
        duration: 5000,
      });

      const toast = useNotificationStore.getState().toasts[0];
      expect(toast.description).toBe("Description");
    });

    it("should add new toasts at the beginning", () => {
      useNotificationStore.getState().addToast({
        title: "First",
        variant: "default",
        duration: 5000,
      });
      useNotificationStore.getState().addToast({
        title: "Second",
        variant: "default",
        duration: 5000,
      });

      const toasts = useNotificationStore.getState().toasts;
      expect(toasts[0].title).toBe("Second");
      expect(toasts[1].title).toBe("First");
    });

    it("should limit toasts to maxToasts", () => {
      for (let i = 0; i < 10; i++) {
        useNotificationStore.getState().addToast({
          title: `Toast ${i}`,
          variant: "default",
          duration: 0,
        });
      }

      expect(useNotificationStore.getState().toasts.length).toBe(5);
    });

    it("should set createdAt timestamp", () => {
      const now = Date.now();
      vi.setSystemTime(now);

      useNotificationStore.getState().addToast({
        title: "Test",
        variant: "default",
        duration: 0,
      });

      expect(useNotificationStore.getState().toasts[0].createdAt).toBe(now);
    });

    it("should auto-dismiss after duration", () => {
      useNotificationStore.getState().addToast({
        title: "Auto Dismiss",
        variant: "default",
        duration: 3000,
      });

      expect(useNotificationStore.getState().toasts.length).toBe(1);

      vi.advanceTimersByTime(3000);

      expect(useNotificationStore.getState().toasts.length).toBe(0);
    });

    it("should not auto-dismiss when duration is 0", () => {
      useNotificationStore.getState().addToast({
        title: "No Auto Dismiss",
        variant: "error",
        duration: 0,
      });

      vi.advanceTimersByTime(10000);

      expect(useNotificationStore.getState().toasts.length).toBe(1);
    });
  });

  describe("dismissToast", () => {
    it("should remove specific toast", () => {
      const id1 = useNotificationStore.getState().addToast({
        title: "Toast 1",
        variant: "default",
        duration: 0,
      });
      const id2 = useNotificationStore.getState().addToast({
        title: "Toast 2",
        variant: "default",
        duration: 0,
      });

      useNotificationStore.getState().dismissToast(id1);

      const toasts = useNotificationStore.getState().toasts;
      expect(toasts.length).toBe(1);
      expect(toasts[0].id).toBe(id2);
    });

    it("should handle dismissing non-existent toast", () => {
      useNotificationStore.getState().addToast({
        title: "Test",
        variant: "default",
        duration: 0,
      });

      // Should not throw
      useNotificationStore.getState().dismissToast("non-existent");

      expect(useNotificationStore.getState().toasts.length).toBe(1);
    });
  });

  describe("dismissAll", () => {
    it("should clear all toasts", () => {
      useNotificationStore.getState().addToast({
        title: "Toast 1",
        variant: "default",
        duration: 0,
      });
      useNotificationStore.getState().addToast({
        title: "Toast 2",
        variant: "default",
        duration: 0,
      });

      useNotificationStore.getState().dismissAll();

      expect(useNotificationStore.getState().toasts).toEqual([]);
    });
  });

  describe("setMaxToasts", () => {
    it("should update maxToasts value", () => {
      useNotificationStore.getState().setMaxToasts(3);

      expect(useNotificationStore.getState().maxToasts).toBe(3);
    });
  });

  describe("toast helpers", () => {
    it("toast.success should add success toast", () => {
      toast.success("Success!");

      const t = useNotificationStore.getState().toasts[0];
      expect(t.variant).toBe("success");
      expect(t.title).toBe("Success!");
    });

    it("toast.error should add error toast with no auto-dismiss", () => {
      toast.error("Error!", "Details");

      const t = useNotificationStore.getState().toasts[0];
      expect(t.variant).toBe("error");
      expect(t.title).toBe("Error!");
      expect(t.description).toBe("Details");
      expect(t.duration).toBe(0);
    });

    it("toast.warning should add warning toast", () => {
      toast.warning("Warning!");

      const t = useNotificationStore.getState().toasts[0];
      expect(t.variant).toBe("warning");
    });

    it("toast.info should add info toast", () => {
      toast.info("Info!");

      const t = useNotificationStore.getState().toasts[0];
      expect(t.variant).toBe("info");
    });

    it("toast.default should add default toast", () => {
      toast.default("Default!");

      const t = useNotificationStore.getState().toasts[0];
      expect(t.variant).toBe("default");
    });
  });
});
