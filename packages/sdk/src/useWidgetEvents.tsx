"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useWidget } from "./useWidget";
import type {
  WidgetEventCallbacks,
  WidgetMountEvent,
  WidgetUnmountEvent,
  WidgetConfigChangeEvent,
  WidgetThemeChangeEvent,
  WidgetResizeEvent,
} from "./events";
import { createEventPayload } from "./events";

/**
 * Generate a unique instance ID
 */
function generateInstanceId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Hook to register widget lifecycle event callbacks
 */
export function useWidgetEvents(callbacks: WidgetEventCallbacks): void {
  const { config, theme } = useWidget();
  const instanceIdRef = useRef<string>(generateInstanceId());
  const prevConfigRef = useRef<Record<string, unknown>>(config);
  const prevThemeRef = useRef<"light" | "dark">(theme.resolved);

  // Mount/Unmount events
  useEffect(() => {
    const instanceId = instanceIdRef.current;

    // Fire mount event
    if (callbacks.onMount) {
      const event: WidgetMountEvent = {
        ...createEventPayload("mount", instanceId),
        type: "mount",
      };
      callbacks.onMount(event);
    }

    // Fire unmount event on cleanup
    return () => {
      if (callbacks.onUnmount) {
        const event: WidgetUnmountEvent = {
          ...createEventPayload("unmount", instanceId),
          type: "unmount",
        };
        callbacks.onUnmount(event);
      }
    };
  }, [callbacks.onMount, callbacks.onUnmount]);

  // Config change events
  useEffect(() => {
    const instanceId = instanceIdRef.current;
    const prevConfig = prevConfigRef.current;

    // Skip initial render
    if (prevConfig === config) return;

    if (callbacks.onConfigChange) {
      const event: WidgetConfigChangeEvent = {
        ...createEventPayload("config-change", instanceId),
        type: "config-change",
        previousConfig: prevConfig,
        newConfig: config,
      };
      callbacks.onConfigChange(event);
    }

    prevConfigRef.current = config;
  }, [config, callbacks.onConfigChange]);

  // Theme change events
  useEffect(() => {
    const instanceId = instanceIdRef.current;
    const prevTheme = prevThemeRef.current;

    // Skip initial render
    if (prevTheme === theme.resolved) return;

    if (callbacks.onThemeChange) {
      const event: WidgetThemeChangeEvent = {
        ...createEventPayload("theme-change", instanceId),
        type: "theme-change",
        previousTheme: prevTheme,
        newTheme: theme.resolved,
      };
      callbacks.onThemeChange(event);
    }

    prevThemeRef.current = theme.resolved;
  }, [theme.resolved, callbacks.onThemeChange]);
}

/**
 * Hook to track widget container resize events
 */
export function useWidgetResize(
  containerRef: React.RefObject<HTMLElement>,
  onResize?: (event: WidgetResizeEvent) => void
): { width: number; height: number } {
  useWidget(); // Ensure we're in a widget context
  const instanceIdRef = useRef<string>(generateInstanceId());
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const instanceId = instanceIdRef.current;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const newSize = { width: Math.round(width), height: Math.round(height) };

        setSize(newSize);

        if (onResize) {
          const event: WidgetResizeEvent = {
            ...createEventPayload("resize", instanceId),
            type: "resize",
            width: newSize.width,
            height: newSize.height,
          };
          onResize(event);
        }
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, onResize]);

  return size;
}

/**
 * Hook to track widget visibility
 */
export function useWidgetVisibility(
  containerRef: React.RefObject<HTMLElement>
): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return isVisible;
}

/**
 * Hook to emit custom widget events
 */
export function useWidgetEmitter() {
  const { manifest } = useWidget();
  const instanceIdRef = useRef<string>(generateInstanceId());

  const emit = useCallback(
    (eventName: string, data?: unknown) => {
      const event = new CustomEvent(`widget:${manifest.id}:${eventName}`, {
        detail: {
          instanceId: instanceIdRef.current,
          widgetId: manifest.id,
          timestamp: Date.now(),
          data,
        },
        bubbles: true,
      });

      document.dispatchEvent(event);
    },
    [manifest.id]
  );

  return { emit };
}
