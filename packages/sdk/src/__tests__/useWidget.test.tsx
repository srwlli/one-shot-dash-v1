/**
 * useWidget Hook Tests
 * Tests for widget context provider and hooks
 */

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React, { type ReactNode } from "react";
import {
  WidgetProvider,
  useWidget,
  useWidgetConfig,
  useWidgetTheme,
  useCapabilities,
  withWidgetContext,
} from "../useWidget";
import type { WidgetManifest } from "../types";

// Mock manifest
const mockManifest: WidgetManifest = {
  id: "test-widget",
  name: "Test Widget",
  version: "1.0.0",
  description: "A test widget",
  author: "Test Author",
  category: "utilities",
  icon: "test-icon",
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 1, height: 1 },
  maxSize: { width: 4, height: 4 },
  defaultConfig: {
    title: "Default Title",
    color: "blue",
  },
};

// Wrapper component for hooks
function createWrapper(props: Partial<React.ComponentProps<typeof WidgetProvider>> = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <WidgetProvider manifest={mockManifest} {...props}>
        {children}
      </WidgetProvider>
    );
  };
}

describe("useWidget", () => {
  it("should return widget context", () => {
    const { result } = renderHook(() => useWidget(), {
      wrapper: createWrapper(),
    });

    expect(result.current.manifest).toEqual(mockManifest);
    expect(result.current.config).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(result.current.capabilities).toBeDefined();
  });

  it("should throw error when used outside provider", () => {
    expect(() => {
      renderHook(() => useWidget());
    }).toThrow("useWidget must be used within a WidgetProvider");
  });

  it("should merge config with defaultConfig", () => {
    const { result } = renderHook(() => useWidget(), {
      wrapper: createWrapper({ config: { title: "Custom Title" } }),
    });

    expect(result.current.config.title).toBe("Custom Title");
    expect(result.current.config.color).toBe("blue"); // from defaultConfig
  });

  it("should include tenantId when provided", () => {
    const { result } = renderHook(() => useWidget(), {
      wrapper: createWrapper({ tenantId: "tenant-123" }),
    });

    expect(result.current.tenantId).toBe("tenant-123");
  });
});

describe("useWidgetConfig", () => {
  it("should return widget config", () => {
    const { result } = renderHook(() => useWidgetConfig<{ title: string; color: string }>(), {
      wrapper: createWrapper({ config: { title: "My Widget" } }),
    });

    expect(result.current.title).toBe("My Widget");
    expect(result.current.color).toBe("blue");
  });
});

describe("useWidgetTheme", () => {
  it("should return default theme", () => {
    const { result } = renderHook(() => useWidgetTheme(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mode).toBe("system");
    expect(result.current.resolved).toBe("light");
  });

  it("should return custom theme", () => {
    const { result } = renderHook(() => useWidgetTheme(), {
      wrapper: createWrapper({
        theme: { mode: "dark", resolved: "dark" },
      }),
    });

    expect(result.current.mode).toBe("dark");
    expect(result.current.resolved).toBe("dark");
  });
});

describe("useCapabilities", () => {
  it("should return default web capabilities", () => {
    const { result } = renderHook(() => useCapabilities(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isWeb).toBe(true);
    expect(result.current.isElectron).toBe(false);
    expect(result.current.isPWA).toBe(false);
    expect(result.current.features.fileSystem).toBe(false);
  });

  it("should return custom capabilities", () => {
    const { result } = renderHook(() => useCapabilities(), {
      wrapper: createWrapper({
        capabilities: {
          isElectron: true,
          isWeb: false,
          isPWA: false,
          features: {
            fileSystem: true,
            notifications: true,
            systemTray: true,
            offline: true,
          },
        },
      }),
    });

    expect(result.current.isElectron).toBe(true);
    expect(result.current.isWeb).toBe(false);
    expect(result.current.features.fileSystem).toBe(true);
  });
});

describe("WidgetProvider", () => {
  it("should render children", () => {
    const TestChild = () => <div>Test Child</div>;

    const { result } = renderHook(
      () => {
        useWidget(); // Just to verify context is available
        return true;
      },
      {
        wrapper: ({ children }) => (
          <WidgetProvider manifest={mockManifest}>{children}</WidgetProvider>
        ),
      }
    );

    expect(result.current).toBe(true);
  });
});

describe("withWidgetContext", () => {
  it("should wrap component with provider", () => {
    const TestComponent = () => {
      const { manifest } = useWidget();
      return <div data-testid="widget-name">{manifest.name}</div>;
    };

    const WrappedComponent = withWidgetContext(TestComponent, mockManifest);

    // Render the wrapped component directly
    const { render: rtlRender } = require("@testing-library/react");
    const { getByTestId } = rtlRender(<WrappedComponent />);

    expect(getByTestId("widget-name")).toHaveTextContent("Test Widget");
  });

  it("should pass config to provider", () => {
    let capturedConfig: Record<string, unknown> | undefined;

    const TestComponent = () => {
      const { config } = useWidget();
      capturedConfig = config;
      return null;
    };

    const WrappedComponent = withWidgetContext(TestComponent, mockManifest);

    renderHook(() => true, {
      wrapper: () => <WrappedComponent config={{ customProp: "value" }} />,
    });

    expect(capturedConfig?.customProp).toBe("value");
  });

  it("should set displayName", () => {
    const NamedComponent = () => null;
    NamedComponent.displayName = "TestComponent";

    const WrappedComponent = withWidgetContext(NamedComponent, mockManifest);

    expect(WrappedComponent.displayName).toBe("WithWidgetContext(TestComponent)");
  });
});
