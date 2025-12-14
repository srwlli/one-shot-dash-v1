/**
 * Widget lifecycle event types
 */
export type WidgetEventType =
  | "mount"
  | "unmount"
  | "config-change"
  | "theme-change"
  | "visibility-change"
  | "resize";

/**
 * Base event payload
 */
export interface WidgetEventPayload {
  /** Event type */
  type: WidgetEventType;
  /** Timestamp of event */
  timestamp: number;
  /** Widget instance ID */
  instanceId: string;
}

/**
 * Mount event - widget was added to DOM
 */
export interface WidgetMountEvent extends WidgetEventPayload {
  type: "mount";
}

/**
 * Unmount event - widget is being removed from DOM
 */
export interface WidgetUnmountEvent extends WidgetEventPayload {
  type: "unmount";
}

/**
 * Config change event - widget configuration was updated
 */
export interface WidgetConfigChangeEvent extends WidgetEventPayload {
  type: "config-change";
  /** Previous configuration */
  previousConfig: Record<string, unknown>;
  /** New configuration */
  newConfig: Record<string, unknown>;
}

/**
 * Theme change event - theme mode changed
 */
export interface WidgetThemeChangeEvent extends WidgetEventPayload {
  type: "theme-change";
  /** Previous theme */
  previousTheme: "light" | "dark";
  /** New theme */
  newTheme: "light" | "dark";
}

/**
 * Visibility change event - widget became visible/hidden
 */
export interface WidgetVisibilityChangeEvent extends WidgetEventPayload {
  type: "visibility-change";
  /** Is widget currently visible */
  isVisible: boolean;
}

/**
 * Resize event - widget container size changed
 */
export interface WidgetResizeEvent extends WidgetEventPayload {
  type: "resize";
  /** New width in pixels */
  width: number;
  /** New height in pixels */
  height: number;
}

/**
 * Union of all widget events
 */
export type WidgetEvent =
  | WidgetMountEvent
  | WidgetUnmountEvent
  | WidgetConfigChangeEvent
  | WidgetThemeChangeEvent
  | WidgetVisibilityChangeEvent
  | WidgetResizeEvent;

/**
 * Event handler function type
 */
export type WidgetEventHandler<T extends WidgetEvent = WidgetEvent> = (
  event: T
) => void;

/**
 * Widget event callbacks interface
 */
export interface WidgetEventCallbacks {
  /** Called when widget mounts */
  onMount?: WidgetEventHandler<WidgetMountEvent>;
  /** Called when widget unmounts */
  onUnmount?: WidgetEventHandler<WidgetUnmountEvent>;
  /** Called when configuration changes */
  onConfigChange?: WidgetEventHandler<WidgetConfigChangeEvent>;
  /** Called when theme changes */
  onThemeChange?: WidgetEventHandler<WidgetThemeChangeEvent>;
  /** Called when visibility changes */
  onVisibilityChange?: WidgetEventHandler<WidgetVisibilityChangeEvent>;
  /** Called when widget resizes */
  onResize?: WidgetEventHandler<WidgetResizeEvent>;
}

/**
 * Create an event payload with timestamp
 */
export function createEventPayload<T extends WidgetEventType>(
  type: T,
  instanceId: string
): WidgetEventPayload & { type: T } {
  return {
    type,
    timestamp: Date.now(),
    instanceId,
  };
}
