"use client";

import { type ReactNode } from "react";
import type { DashboardLayout } from "@platform/sdk";
import { LayoutEngine, EmptyLayout } from "./LayoutEngine";

/**
 * Props for Dashboard component
 */
export interface DashboardProps {
  /** Layout configuration */
  layout?: DashboardLayout;
  /** Dashboard title */
  title?: string;
  /** Header actions slot */
  actions?: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Dashboard container component
 * Provides structure around the LayoutEngine
 */
export function Dashboard({
  layout,
  title,
  actions,
  className = "",
}: DashboardProps): ReactNode {
  return (
    <div className={`dashboard ${className}`}>
      {(title || actions) && (
        <header className="dashboard-header flex items-center justify-between mb-6">
          {title && (
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          )}
          {actions && <div className="dashboard-actions">{actions}</div>}
        </header>
      )}

      <main className="dashboard-content">
        {layout && layout.widgets.length > 0 ? (
          <LayoutEngine layout={layout} />
        ) : (
          <EmptyLayout />
        )}
      </main>
    </div>
  );
}

/**
 * Dashboard loading skeleton
 */
export function DashboardSkeleton(): ReactNode {
  return (
    <div className="dashboard">
      <header className="dashboard-header flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </header>

      <main className="dashboard-content">
        <div className="grid grid-cols-12 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="col-span-6 lg:col-span-3 h-48 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
