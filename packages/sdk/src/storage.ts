/**
 * Storage item with metadata
 */
export interface StorageItem<T = unknown> {
  /** The stored value */
  value: T;
  /** When the item was created */
  createdAt: number;
  /** When the item was last updated */
  updatedAt: number;
  /** Optional expiration timestamp */
  expiresAt?: number;
}

/**
 * Storage options for set operations
 */
export interface StorageSetOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
}

/**
 * Widget storage interface - abstraction over storage backends
 */
export interface WidgetStorage {
  /**
   * Get a value from storage
   * @param key - Storage key (namespaced to widget)
   * @returns The stored value or undefined if not found
   */
  get<T = unknown>(key: string): Promise<T | undefined>;

  /**
   * Set a value in storage
   * @param key - Storage key (namespaced to widget)
   * @param value - Value to store (must be JSON-serializable)
   * @param options - Storage options
   */
  set<T = unknown>(key: string, value: T, options?: StorageSetOptions): Promise<void>;

  /**
   * Remove a value from storage
   * @param key - Storage key (namespaced to widget)
   */
  remove(key: string): Promise<void>;

  /**
   * Check if a key exists in storage
   * @param key - Storage key (namespaced to widget)
   */
  has(key: string): Promise<boolean>;

  /**
   * Get all keys for this widget
   * @returns Array of storage keys
   */
  keys(): Promise<string[]>;

  /**
   * Clear all storage for this widget
   */
  clear(): Promise<void>;
}

/**
 * Storage event types
 */
export type StorageEventType = "set" | "remove" | "clear";

/**
 * Storage change event
 */
export interface StorageChangeEvent {
  /** Event type */
  type: StorageEventType;
  /** Affected key (undefined for clear) */
  key?: string;
  /** Previous value (for set/remove) */
  previousValue?: unknown;
  /** New value (for set) */
  newValue?: unknown;
}

/**
 * Storage change listener
 */
export type StorageChangeListener = (event: StorageChangeEvent) => void;

/**
 * Extended storage interface with change notifications
 */
export interface ObservableWidgetStorage extends WidgetStorage {
  /**
   * Subscribe to storage changes
   * @param listener - Callback for changes
   * @returns Unsubscribe function
   */
  subscribe(listener: StorageChangeListener): () => void;
}

/**
 * Create a namespaced key for widget storage
 */
export function createStorageKey(widgetId: string, key: string): string {
  return `widget:${widgetId}:${key}`;
}

/**
 * Parse a namespaced storage key
 */
export function parseStorageKey(
  fullKey: string
): { widgetId: string; key: string } | null {
  const match = fullKey.match(/^widget:([^:]+):(.+)$/);
  if (!match) return null;
  return { widgetId: match[1], key: match[2] };
}
