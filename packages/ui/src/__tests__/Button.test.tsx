/**
 * Button Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Button } from "../components/button";

describe("Button", () => {
  describe("rendering", () => {
    it("should render button with children", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("should render as button element", () => {
      render(<Button>Click</Button>);

      // Button component uses Slot by default (not asChild), so it's a button element
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should allow custom type", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Click</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("variants", () => {
    it("should render default variant", () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-primary");
    });

    it("should render destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-destructive");
    });

    it("should render outline variant", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("border");
    });

    it("should render secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-secondary");
    });

    it("should render ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("hover:bg-accent");
    });

    it("should render link variant", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("underline-offset-4");
    });
  });

  describe("sizes", () => {
    it("should render default size", () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("h-10");
    });

    it("should render small size", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("h-9");
    });

    it("should render large size", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("h-11");
    });

    it("should render icon size", () => {
      render(<Button size="icon">🔍</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("h-10");
      expect(button.className).toContain("w-10");
    });
  });

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should have disabled styles", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("disabled:opacity-50");
    });
  });

  describe("interactions", () => {
    it("should call onClick when clicked", () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);

      fireEvent.click(screen.getByRole("button"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      const onClick = vi.fn();
      render(
        <Button onClick={onClick} disabled>
          Click me
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("asChild", () => {
    it("should render as child element when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveTextContent("Link Button");
    });
  });

  describe("className", () => {
    it("should merge custom className", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
      expect(button.className).toContain("bg-primary"); // default styles still applied
    });
  });

  describe("accessibility", () => {
    it("should support aria-label", () => {
      render(<Button aria-label="Close dialog">✕</Button>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Close dialog"
      );
    });

    it("should support aria-disabled", () => {
      render(<Button aria-disabled="true">Aria Disabled</Button>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });
});
