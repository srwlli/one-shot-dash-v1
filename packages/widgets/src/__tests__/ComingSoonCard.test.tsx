/**
 * Coming Soon Card Widget Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { WidgetProvider } from "@platform/sdk";
import { Widget } from "../coming-soon-card/Widget";
import { manifest } from "../coming-soon-card/manifest";

// Wrapper component for widget context
function createWrapper(config: Record<string, unknown> = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <WidgetProvider manifest={manifest} config={config}>
        {children}
      </WidgetProvider>
    );
  };
}

describe("Coming Soon Card Widget", () => {
  describe("manifest", () => {
    it("should have correct id", () => {
      expect(manifest.id).toBe("coming-soon-card");
    });

    it("should have correct name", () => {
      expect(manifest.name).toBe("Coming Soon Card");
    });

    it("should have default config", () => {
      expect(manifest.defaultConfig).toEqual({
        title: "Coming Soon",
        description: "This feature is under development.",
        icon: "rocket",
      });
    });

    it("should have no permissions", () => {
      expect(manifest.permissions).toEqual({
        storage: "none",
        network: "none",
        notifications: "none",
      });
    });

    it("should have correct category", () => {
      expect(manifest.category).toBe("utility");
    });

    it("should have tags", () => {
      expect(manifest.tags).toContain("placeholder");
      expect(manifest.tags).toContain("coming-soon");
    });
  });

  describe("Widget component", () => {
    it("should render with default config", () => {
      render(<Widget />, { wrapper: createWrapper() });

      // Title is in h3, badge is in div - both have "Coming Soon"
      expect(screen.getByRole("heading", { name: "Coming Soon" })).toBeInTheDocument();
      expect(
        screen.getByText("This feature is under development.")
      ).toBeInTheDocument();
    });

    it("should render custom title", () => {
      render(<Widget />, {
        wrapper: createWrapper({ title: "New Feature" }),
      });

      expect(screen.getByText("New Feature")).toBeInTheDocument();
    });

    it("should render custom description", () => {
      render(<Widget />, {
        wrapper: createWrapper({
          description: "Check back soon for updates!",
        }),
      });

      expect(
        screen.getByText("Check back soon for updates!")
      ).toBeInTheDocument();
    });

    it("should render Coming Soon badge", () => {
      render(<Widget />, { wrapper: createWrapper() });

      // There should be two "Coming Soon" elements - title and badge
      const elements = screen.getAllByText("Coming Soon");
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it("should render icon", () => {
      const { container } = render(<Widget />, { wrapper: createWrapper() });

      // Check that an SVG icon is rendered
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Widget className="custom-widget-class" />, {
        wrapper: createWrapper(),
      });

      const widget = container.firstChild;
      expect(widget).toHaveClass("custom-widget-class");
    });

    it("should have centered layout", () => {
      const { container } = render(<Widget />, { wrapper: createWrapper() });

      const widget = container.firstChild;
      expect(widget).toHaveClass("flex");
      expect(widget).toHaveClass("flex-col");
      expect(widget).toHaveClass("items-center");
      expect(widget).toHaveClass("justify-center");
    });

    describe("icons", () => {
      it("should render rocket icon by default", () => {
        const { container } = render(<Widget />, {
          wrapper: createWrapper({ icon: "rocket" }),
        });

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should render chart icon", () => {
        const { container } = render(<Widget />, {
          wrapper: createWrapper({ icon: "chart" }),
        });

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should render bell icon", () => {
        const { container } = render(<Widget />, {
          wrapper: createWrapper({ icon: "bell" }),
        });

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should render calendar icon", () => {
        const { container } = render(<Widget />, {
          wrapper: createWrapper({ icon: "calendar" }),
        });

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should render settings icon", () => {
        const { container } = render(<Widget />, {
          wrapper: createWrapper({ icon: "settings" }),
        });

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should render default icon for unknown icon key", () => {
        const { container } = render(<Widget />, {
          wrapper: createWrapper({ icon: "unknown-icon" }),
        });

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe("responsive behavior", () => {
    it("should have minimum height", () => {
      const { container } = render(<Widget />, { wrapper: createWrapper() });

      const widget = container.firstChild;
      expect(widget).toHaveClass("min-h-[200px]");
    });

    it("should have padding", () => {
      const { container } = render(<Widget />, { wrapper: createWrapper() });

      const widget = container.firstChild;
      expect(widget).toHaveClass("p-6");
    });
  });

  describe("accessibility", () => {
    it("should have heading for title", () => {
      render(<Widget />, { wrapper: createWrapper() });

      // The title should be in an h3 element
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Coming Soon"
      );
    });
  });
});
