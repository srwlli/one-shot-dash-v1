"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  /** Title to display in the nav */
  title?: string;
  /** Actions to display on the right side */
  actions?: React.ReactNode;
}

const Nav = React.forwardRef<HTMLElement, NavProps>(
  ({ className, title, actions, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center justify-between border-b bg-background px-4 py-3",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          {title && (
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          )}
          {children}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </nav>
    );
  }
);
Nav.displayName = "Nav";

const NavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});
NavItem.displayName = "NavItem";

const NavGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-4", className)}
      {...props}
    />
  );
});
NavGroup.displayName = "NavGroup";

export { Nav, NavItem, NavGroup };
