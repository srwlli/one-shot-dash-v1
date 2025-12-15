/**
 * Notification Store
 * Toast notifications: queue, auto-dismiss
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { NotificationStore, NotificationState, Toast } from "./types";

const initialState: NotificationState = {
  toasts: [],
  maxToasts: 5,
};

let toastIdCounter = 0;

const generateId = () => `toast-${++toastIdCounter}-${Date.now()}`;

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addToast: (toast) => {
        const id = generateId();
        const newToast: Toast = {
          ...toast,
          id,
          createdAt: Date.now(),
        };

        set(
          (state) => {
            const toasts = [newToast, ...state.toasts].slice(0, state.maxToasts);
            return { toasts };
          },
          false,
          "addToast"
        );

        // Auto-dismiss if duration > 0
        if (toast.duration > 0) {
          setTimeout(() => {
            get().dismissToast(id);
          }, toast.duration);
        }

        return id;
      },

      dismissToast: (id) =>
        set(
          (state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }),
          false,
          "dismissToast"
        ),

      dismissAll: () => set({ toasts: [] }, false, "dismissAll"),

      setMaxToasts: (max) => set({ maxToasts: max }, false, "setMaxToasts"),
    }),
    { name: "NotificationStore" }
  )
);

// Helper functions for common toast types
export const toast = {
  success: (title: string, description?: string, duration = 5000) =>
    useNotificationStore.getState().addToast({
      title,
      description,
      variant: "success",
      duration,
    }),

  error: (title: string, description?: string, duration = 0) =>
    useNotificationStore.getState().addToast({
      title,
      description,
      variant: "error",
      duration, // errors don't auto-dismiss by default
    }),

  warning: (title: string, description?: string, duration = 5000) =>
    useNotificationStore.getState().addToast({
      title,
      description,
      variant: "warning",
      duration,
    }),

  info: (title: string, description?: string, duration = 5000) =>
    useNotificationStore.getState().addToast({
      title,
      description,
      variant: "info",
      duration,
    }),

  default: (title: string, description?: string, duration = 5000) =>
    useNotificationStore.getState().addToast({
      title,
      description,
      variant: "default",
      duration,
    }),
};
