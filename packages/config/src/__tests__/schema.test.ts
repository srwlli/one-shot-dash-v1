/**
 * Config Package Tests
 * Tests for schema validation and utility functions
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  generateInstanceId,
  normalizeLayout,
  validateLayout,
  validateTenant,
  type LayoutConfig,
  type TenantConfig,
} from "../schema";

describe("generateInstanceId", () => {
  it("should generate unique IDs with widget prefix", () => {
    const id1 = generateInstanceId("my-widget");
    const id2 = generateInstanceId("my-widget");

    expect(id1).toMatch(/^my-widget-\d+-[a-z0-9]+$/);
    expect(id2).toMatch(/^my-widget-\d+-[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });

  it("should generate different IDs for different widgets", () => {
    const id1 = generateInstanceId("widget-a");
    const id2 = generateInstanceId("widget-b");

    expect(id1).toContain("widget-a");
    expect(id2).toContain("widget-b");
  });
});

describe("normalizeLayout", () => {
  it("should add instanceIds to widgets without them", () => {
    const layout: LayoutConfig = {
      id: "test-layout",
      name: "Test Layout",
      widgets: [
        { widgetId: "widget-1" },
        { widgetId: "widget-2" },
      ],
    };

    const normalized = normalizeLayout(layout);

    expect(normalized.widgets[0].instanceId).toBeDefined();
    expect(normalized.widgets[1].instanceId).toBeDefined();
    expect(normalized.widgets[0].instanceId).toContain("widget-1");
    expect(normalized.widgets[1].instanceId).toContain("widget-2");
  });

  it("should preserve existing instanceIds", () => {
    const layout: LayoutConfig = {
      id: "test-layout",
      name: "Test Layout",
      widgets: [
        { widgetId: "widget-1", instanceId: "existing-id" },
        { widgetId: "widget-2" },
      ],
    };

    const normalized = normalizeLayout(layout);

    expect(normalized.widgets[0].instanceId).toBe("existing-id");
    expect(normalized.widgets[1].instanceId).toContain("widget-2");
  });

  it("should preserve all other widget properties", () => {
    const layout: LayoutConfig = {
      id: "test-layout",
      name: "Test Layout",
      columns: 12,
      gap: 20,
      widgets: [
        {
          widgetId: "widget-1",
          column: 1,
          row: 1,
          colSpan: 2,
          rowSpan: 2,
          config: { key: "value" },
        },
      ],
    };

    const normalized = normalizeLayout(layout);

    expect(normalized.id).toBe("test-layout");
    expect(normalized.name).toBe("Test Layout");
    expect(normalized.columns).toBe(12);
    expect(normalized.gap).toBe(20);
    expect(normalized.widgets[0].column).toBe(1);
    expect(normalized.widgets[0].row).toBe(1);
    expect(normalized.widgets[0].colSpan).toBe(2);
    expect(normalized.widgets[0].rowSpan).toBe(2);
    expect(normalized.widgets[0].config).toEqual({ key: "value" });
  });
});

describe("validateLayout", () => {
  it("should return true for valid layout", () => {
    const layout: LayoutConfig = {
      id: "test-layout",
      name: "Test Layout",
      widgets: [
        { widgetId: "widget-1" },
      ],
    };

    expect(validateLayout(layout)).toBe(true);
  });

  it("should return false for null/undefined", () => {
    expect(validateLayout(null)).toBe(false);
    expect(validateLayout(undefined)).toBe(false);
  });

  it("should return false for non-object", () => {
    expect(validateLayout("string")).toBe(false);
    expect(validateLayout(123)).toBe(false);
    expect(validateLayout([])).toBe(false);
  });

  it("should return false for missing id", () => {
    expect(validateLayout({ name: "Test", widgets: [] })).toBe(false);
    expect(validateLayout({ id: "", name: "Test", widgets: [] })).toBe(false);
  });

  it("should return false for missing name", () => {
    expect(validateLayout({ id: "test", widgets: [] })).toBe(false);
    expect(validateLayout({ id: "test", name: "", widgets: [] })).toBe(false);
  });

  it("should return false for missing or invalid widgets array", () => {
    expect(validateLayout({ id: "test", name: "Test" })).toBe(false);
    expect(validateLayout({ id: "test", name: "Test", widgets: "not-array" })).toBe(false);
  });

  it("should return false for invalid widget entries", () => {
    expect(validateLayout({
      id: "test",
      name: "Test",
      widgets: [null],
    })).toBe(false);

    expect(validateLayout({
      id: "test",
      name: "Test",
      widgets: [{ widgetId: 123 }],
    })).toBe(false);

    expect(validateLayout({
      id: "test",
      name: "Test",
      widgets: [{}],
    })).toBe(false);
  });

  it("should return true for layout with empty widgets array", () => {
    expect(validateLayout({
      id: "test",
      name: "Test",
      widgets: [],
    })).toBe(true);
  });
});

describe("validateTenant", () => {
  it("should return true for valid tenant", () => {
    const tenant: TenantConfig = {
      id: "tenant-1",
      name: "Test Tenant",
      defaultLayout: "default",
    };

    expect(validateTenant(tenant)).toBe(true);
  });

  it("should return true for tenant with all optional fields", () => {
    const tenant: TenantConfig = {
      id: "tenant-1",
      name: "Test Tenant",
      logo: "/logo.png",
      defaultLayout: "default",
      layouts: ["default", "compact"],
      features: {
        customizeDashboard: true,
        marketplace: true,
        darkMode: true,
      },
      theme: {
        primaryColor: "#007bff",
        accentColor: "#6c757d",
      },
    };

    expect(validateTenant(tenant)).toBe(true);
  });

  it("should return false for null/undefined", () => {
    expect(validateTenant(null)).toBe(false);
    expect(validateTenant(undefined)).toBe(false);
  });

  it("should return false for non-object", () => {
    expect(validateTenant("string")).toBe(false);
    expect(validateTenant(123)).toBe(false);
  });

  it("should return false for missing id", () => {
    expect(validateTenant({ name: "Test", defaultLayout: "default" })).toBe(false);
    expect(validateTenant({ id: "", name: "Test", defaultLayout: "default" })).toBe(false);
  });

  it("should return false for missing name", () => {
    expect(validateTenant({ id: "test", defaultLayout: "default" })).toBe(false);
    expect(validateTenant({ id: "test", name: "", defaultLayout: "default" })).toBe(false);
  });

  it("should return false for missing defaultLayout", () => {
    expect(validateTenant({ id: "test", name: "Test" })).toBe(false);
    expect(validateTenant({ id: "test", name: "Test", defaultLayout: "" })).toBe(false);
  });
});
