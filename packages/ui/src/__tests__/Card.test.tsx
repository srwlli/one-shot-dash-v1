/**
 * Card Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/card";

describe("Card", () => {
  describe("Card component", () => {
    it("should render card with children", () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("should have card styles", () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId("card");
      expect(card.className).toContain("rounded-lg");
      expect(card.className).toContain("border");
      expect(card.className).toContain("shadow-sm");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should merge custom className", () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );

      const card = screen.getByTestId("card");
      expect(card.className).toContain("custom-class");
    });
  });

  describe("CardHeader component", () => {
    it("should render header content", () => {
      render(<CardHeader>Header</CardHeader>);

      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should have header styles", () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);

      const header = screen.getByTestId("header");
      expect(header.className).toContain("p-6");
      expect(header.className).toContain("flex");
      expect(header.className).toContain("flex-col");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Header</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardTitle component", () => {
    it("should render as h3 heading", () => {
      render(<CardTitle>Title</CardTitle>);

      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Title"
      );
    });

    it("should have title styles", () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);

      const title = screen.getByTestId("title");
      expect(title.className).toContain("text-2xl");
      expect(title.className).toContain("font-semibold");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe("CardDescription component", () => {
    it("should render description text", () => {
      render(<CardDescription>Description text</CardDescription>);

      expect(screen.getByText("Description text")).toBeInTheDocument();
    });

    it("should have description styles", () => {
      render(
        <CardDescription data-testid="desc">Description</CardDescription>
      );

      const desc = screen.getByTestId("desc");
      expect(desc.className).toContain("text-sm");
      expect(desc.className).toContain("text-muted-foreground");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<CardDescription ref={ref}>Description</CardDescription>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe("CardContent component", () => {
    it("should render content", () => {
      render(<CardContent>Main content</CardContent>);

      expect(screen.getByText("Main content")).toBeInTheDocument();
    });

    it("should have content styles", () => {
      render(<CardContent data-testid="content">Content</CardContent>);

      const content = screen.getByTestId("content");
      expect(content.className).toContain("p-6");
      expect(content.className).toContain("pt-0");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardFooter component", () => {
    it("should render footer content", () => {
      render(<CardFooter>Footer</CardFooter>);

      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("should have footer styles", () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);

      const footer = screen.getByTestId("footer");
      expect(footer.className).toContain("flex");
      expect(footer.className).toContain("items-center");
      expect(footer.className).toContain("p-6");
      expect(footer.className).toContain("pt-0");
    });

    it("should forward ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("composed Card", () => {
    it("should render complete card with all parts", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card description goes here")).toBeInTheDocument();
      expect(
        screen.getByText("This is the main content of the card.")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });
  });
});
