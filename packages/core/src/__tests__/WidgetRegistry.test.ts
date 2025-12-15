/**
 * Widget Registry Tests
 * Tests for widget registration and lookup
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { WidgetRegistry, createWidgetRegistry } from "../dashboard/WidgetRegistry";
import type { WidgetDefinition, WidgetManifest } from "@platform/sdk";

// Mock widget component
const MockWidget = () => null;

// Helper to create mock widget definition
function createMockDefinition(
  id: string,
  overrides: Partial<WidgetManifest> = {}
): WidgetDefinition {
  return {
    Widget: MockWidget,
    manifest: {
      id,
      name: `Widget ${id}`,
      version: "1.0.0",
      description: `Description for ${id}`,
      author: "Test Author",
      category: "utilities",
      icon: "test-icon",
      defaultSize: { width: 2, height: 2 },
      minSize: { width: 1, height: 1 },
      maxSize: { width: 4, height: 4 },
      ...overrides,
    },
  };
}

describe("WidgetRegistry", () => {
  let registry: WidgetRegistry;

  beforeEach(() => {
    registry = createWidgetRegistry();
  });

  describe("register", () => {
    it("should register a widget", () => {
      const definition = createMockDefinition("widget-1");

      registry.register(definition);

      expect(registry.has("widget-1")).toBe(true);
      expect(registry.size).toBe(1);
    });

    it("should register with source", () => {
      const definition = createMockDefinition("widget-1");

      registry.register(definition, "test-source");

      expect(registry.has("widget-1")).toBe(true);
    });

    it("should overwrite existing widget with same ID", () => {
      const def1 = createMockDefinition("widget-1", { name: "First" });
      const def2 = createMockDefinition("widget-1", { name: "Second" });

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      registry.register(def1);
      registry.register(def2);

      expect(registry.size).toBe(1);
      expect(registry.getManifest("widget-1")?.name).toBe("Second");
      expect(consoleSpy).toHaveBeenCalledWith(
        'Widget "widget-1" is already registered. Overwriting.'
      );

      consoleSpy.mockRestore();
    });
  });

  describe("registerAll", () => {
    it("should register multiple widgets", () => {
      const definitions = [
        createMockDefinition("widget-1"),
        createMockDefinition("widget-2"),
        createMockDefinition("widget-3"),
      ];

      registry.registerAll(definitions);

      expect(registry.size).toBe(3);
      expect(registry.has("widget-1")).toBe(true);
      expect(registry.has("widget-2")).toBe(true);
      expect(registry.has("widget-3")).toBe(true);
    });

    it("should register all with source", () => {
      const definitions = [
        createMockDefinition("widget-1"),
        createMockDefinition("widget-2"),
      ];

      registry.registerAll(definitions, "batch-source");

      expect(registry.size).toBe(2);
    });
  });

  describe("unregister", () => {
    it("should unregister a widget", () => {
      registry.register(createMockDefinition("widget-1"));

      const result = registry.unregister("widget-1");

      expect(result).toBe(true);
      expect(registry.has("widget-1")).toBe(false);
      expect(registry.size).toBe(0);
    });

    it("should return false for non-existent widget", () => {
      const result = registry.unregister("non-existent");

      expect(result).toBe(false);
    });
  });

  describe("get", () => {
    it("should return widget definition", () => {
      const definition = createMockDefinition("widget-1");
      registry.register(definition);

      const result = registry.get("widget-1");

      expect(result).toBe(definition);
    });

    it("should return undefined for non-existent widget", () => {
      const result = registry.get("non-existent");

      expect(result).toBeUndefined();
    });
  });

  describe("getComponent", () => {
    it("should return widget component", () => {
      registry.register(createMockDefinition("widget-1"));

      const component = registry.getComponent("widget-1");

      expect(component).toBe(MockWidget);
    });

    it("should return undefined for non-existent widget", () => {
      const component = registry.getComponent("non-existent");

      expect(component).toBeUndefined();
    });
  });

  describe("getManifest", () => {
    it("should return widget manifest", () => {
      const definition = createMockDefinition("widget-1", { name: "Test Widget" });
      registry.register(definition);

      const manifest = registry.getManifest("widget-1");

      expect(manifest?.id).toBe("widget-1");
      expect(manifest?.name).toBe("Test Widget");
    });

    it("should return undefined for non-existent widget", () => {
      const manifest = registry.getManifest("non-existent");

      expect(manifest).toBeUndefined();
    });
  });

  describe("getAll", () => {
    it("should return all widget definitions", () => {
      registry.register(createMockDefinition("widget-1"));
      registry.register(createMockDefinition("widget-2"));

      const all = registry.getAll();

      expect(all.length).toBe(2);
      expect(all.map((d) => d.manifest.id)).toContain("widget-1");
      expect(all.map((d) => d.manifest.id)).toContain("widget-2");
    });

    it("should return empty array when no widgets", () => {
      const all = registry.getAll();

      expect(all).toEqual([]);
    });
  });

  describe("getIds", () => {
    it("should return all widget IDs", () => {
      registry.register(createMockDefinition("widget-1"));
      registry.register(createMockDefinition("widget-2"));

      const ids = registry.getIds();

      expect(ids).toContain("widget-1");
      expect(ids).toContain("widget-2");
    });
  });

  describe("getAllManifests", () => {
    it("should return all manifests", () => {
      registry.register(createMockDefinition("widget-1"));
      registry.register(createMockDefinition("widget-2"));

      const manifests = registry.getAllManifests();

      expect(manifests.length).toBe(2);
      expect(manifests.map((m) => m.id)).toContain("widget-1");
    });
  });

  describe("has", () => {
    it("should return true for registered widget", () => {
      registry.register(createMockDefinition("widget-1"));

      expect(registry.has("widget-1")).toBe(true);
    });

    it("should return false for non-registered widget", () => {
      expect(registry.has("non-existent")).toBe(false);
    });
  });

  describe("size", () => {
    it("should return correct count", () => {
      expect(registry.size).toBe(0);

      registry.register(createMockDefinition("widget-1"));
      expect(registry.size).toBe(1);

      registry.register(createMockDefinition("widget-2"));
      expect(registry.size).toBe(2);

      registry.unregister("widget-1");
      expect(registry.size).toBe(1);
    });
  });

  describe("clear", () => {
    it("should remove all widgets", () => {
      registry.register(createMockDefinition("widget-1"));
      registry.register(createMockDefinition("widget-2"));

      registry.clear();

      expect(registry.size).toBe(0);
      expect(registry.has("widget-1")).toBe(false);
      expect(registry.has("widget-2")).toBe(false);
    });
  });

  describe("subscribe", () => {
    it("should notify listeners on register", () => {
      const listener = vi.fn();
      registry.subscribe(listener);

      registry.register(createMockDefinition("widget-1"));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should notify listeners on unregister", () => {
      registry.register(createMockDefinition("widget-1"));

      const listener = vi.fn();
      registry.subscribe(listener);

      registry.unregister("widget-1");

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should notify listeners on clear", () => {
      const listener = vi.fn();
      registry.subscribe(listener);

      registry.clear();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should return unsubscribe function", () => {
      const listener = vi.fn();
      const unsubscribe = registry.subscribe(listener);

      unsubscribe();
      registry.register(createMockDefinition("widget-1"));

      expect(listener).not.toHaveBeenCalled();
    });

    it("should support multiple listeners", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      registry.subscribe(listener1);
      registry.subscribe(listener2);

      registry.register(createMockDefinition("widget-1"));

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe("findByCategory", () => {
    beforeEach(() => {
      registry.register(createMockDefinition("w1", { category: "analytics" }));
      registry.register(createMockDefinition("w2", { category: "analytics" }));
      registry.register(createMockDefinition("w3", { category: "utilities" }));
    });

    it("should find widgets by category", () => {
      const analytics = registry.findByCategory("analytics");

      expect(analytics.length).toBe(2);
      expect(analytics.map((d) => d.manifest.id)).toContain("w1");
      expect(analytics.map((d) => d.manifest.id)).toContain("w2");
    });

    it("should return empty array for non-existent category", () => {
      const result = registry.findByCategory("non-existent");

      expect(result).toEqual([]);
    });
  });

  describe("findByTag", () => {
    beforeEach(() => {
      registry.register(createMockDefinition("w1", { tags: ["chart", "data"] }));
      registry.register(createMockDefinition("w2", { tags: ["chart"] }));
      registry.register(createMockDefinition("w3", { tags: ["utility"] }));
    });

    it("should find widgets by tag", () => {
      const charts = registry.findByTag("chart");

      expect(charts.length).toBe(2);
      expect(charts.map((d) => d.manifest.id)).toContain("w1");
      expect(charts.map((d) => d.manifest.id)).toContain("w2");
    });

    it("should return empty array for non-existent tag", () => {
      const result = registry.findByTag("non-existent");

      expect(result).toEqual([]);
    });
  });

  describe("search", () => {
    beforeEach(() => {
      registry.register(createMockDefinition("w1", {
        name: "Sales Chart",
        description: "Display sales data",
      }));
      registry.register(createMockDefinition("w2", {
        name: "User List",
        description: "Show users",
      }));
      registry.register(createMockDefinition("w3", {
        name: "Revenue Report",
        description: "Sales analysis",
      }));
    });

    it("should find widgets by name", () => {
      const results = registry.search("sales");

      expect(results.length).toBe(2); // "Sales Chart" and "Revenue Report" (sales in description)
    });

    it("should find widgets by description", () => {
      const results = registry.search("users");

      expect(results.length).toBe(1);
      expect(results[0].manifest.id).toBe("w2");
    });

    it("should be case-insensitive", () => {
      const results = registry.search("SALES");

      expect(results.length).toBe(2);
    });

    it("should return empty array for no matches", () => {
      const results = registry.search("nonexistent");

      expect(results).toEqual([]);
    });
  });
});

describe("createWidgetRegistry", () => {
  it("should create a new registry instance", () => {
    const registry = createWidgetRegistry();

    expect(registry).toBeInstanceOf(WidgetRegistry);
    expect(registry.size).toBe(0);
  });
});
