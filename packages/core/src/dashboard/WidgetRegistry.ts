import type { WidgetDefinition, WidgetManifest } from "@platform/sdk";
import type { ComponentType } from "react";

/**
 * Widget entry in the registry
 */
export interface WidgetEntry {
  /** Widget definition (component + manifest) */
  definition: WidgetDefinition;
  /** Registration timestamp */
  registeredAt: number;
  /** Source (for debugging) */
  source?: string;
}

/**
 * Registry for managing widget definitions
 * Apps compose widgets into this registry, which core then uses to render
 */
export class WidgetRegistry {
  private widgets: Map<string, WidgetEntry> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Register a widget definition
   * @param definition Widget definition with component and manifest
   * @param source Optional source identifier for debugging
   */
  register(definition: WidgetDefinition, source?: string): void {
    const { manifest } = definition;

    if (this.widgets.has(manifest.id)) {
      console.warn(
        `Widget "${manifest.id}" is already registered. Overwriting.`
      );
    }

    this.widgets.set(manifest.id, {
      definition,
      registeredAt: Date.now(),
      source,
    });

    this.notifyListeners();
  }

  /**
   * Register multiple widget definitions at once
   * @param definitions Array of widget definitions
   * @param source Optional source identifier for debugging
   */
  registerAll(definitions: WidgetDefinition[], source?: string): void {
    for (const definition of definitions) {
      this.register(definition, source);
    }
  }

  /**
   * Unregister a widget by ID
   * @param widgetId Widget ID to remove
   */
  unregister(widgetId: string): boolean {
    const result = this.widgets.delete(widgetId);
    if (result) {
      this.notifyListeners();
    }
    return result;
  }

  /**
   * Get a widget definition by ID
   * @param widgetId Widget ID to look up
   */
  get(widgetId: string): WidgetDefinition | undefined {
    return this.widgets.get(widgetId)?.definition;
  }

  /**
   * Get widget component by ID
   * @param widgetId Widget ID to look up
   */
  getComponent(widgetId: string): ComponentType<{ config?: Record<string, unknown> }> | undefined {
    return this.widgets.get(widgetId)?.definition.Widget;
  }

  /**
   * Get widget manifest by ID
   * @param widgetId Widget ID to look up
   */
  getManifest(widgetId: string): WidgetManifest | undefined {
    return this.widgets.get(widgetId)?.definition.manifest;
  }

  /**
   * Get all registered widget definitions
   */
  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values()).map((entry) => entry.definition);
  }

  /**
   * Get all widget IDs
   */
  getIds(): string[] {
    return Array.from(this.widgets.keys());
  }

  /**
   * Get all widget manifests
   */
  getAllManifests(): WidgetManifest[] {
    return this.getAll().map((def) => def.manifest);
  }

  /**
   * Check if a widget is registered
   * @param widgetId Widget ID to check
   */
  has(widgetId: string): boolean {
    return this.widgets.has(widgetId);
  }

  /**
   * Get the number of registered widgets
   */
  get size(): number {
    return this.widgets.size;
  }

  /**
   * Clear all registered widgets
   */
  clear(): void {
    this.widgets.clear();
    this.notifyListeners();
  }

  /**
   * Subscribe to registry changes
   * @param listener Callback when registry changes
   * @returns Unsubscribe function
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of a change
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Find widgets by category
   * @param category Category to filter by
   */
  findByCategory(category: string): WidgetDefinition[] {
    return this.getAll().filter((def) => def.manifest.category === category);
  }

  /**
   * Find widgets by tag
   * @param tag Tag to filter by
   */
  findByTag(tag: string): WidgetDefinition[] {
    return this.getAll().filter((def) =>
      def.manifest.tags?.includes(tag)
    );
  }

  /**
   * Search widgets by name or description
   * @param query Search query
   */
  search(query: string): WidgetDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      (def) =>
        def.manifest.name.toLowerCase().includes(lowerQuery) ||
        def.manifest.description.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * Create a new widget registry
 */
export function createWidgetRegistry(): WidgetRegistry {
  return new WidgetRegistry();
}
