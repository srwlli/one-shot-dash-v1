"use client";

import { useMemo, type ReactNode } from "react";
import type { DashboardLayout, WidgetLayoutItem } from "@platform/sdk";
import { WidgetProvider } from "@platform/sdk";
import { usePlatform } from "../platform/PlatformProvider";

/**
 * Props for LayoutEngine
 */
export interface LayoutEngineProps {
  /** Layout configuration */
  layout: DashboardLayout;
  /** Additional class names for the grid container */
  className?: string;
}

/**
 * Props for individual widget wrapper
 */
interface WidgetWrapperProps {
  /** Widget layout item */
  item: WidgetLayoutItem;
  /** Children (the actual widget) */
  children: ReactNode;
}

/**
 * Wrapper component for positioning widgets in the grid
 */
function WidgetWrapper({ item, children }: WidgetWrapperProps): ReactNode {
  const style = useMemo(() => {
    const result: React.CSSProperties = {};

    if (item.column !== undefined) {
      result.gridColumn = item.colSpan
        ? `${item.column} / span ${item.colSpan}`
        : item.column;
    }

    if (item.row !== undefined) {
      result.gridRow = item.rowSpan
        ? `${item.row} / span ${item.rowSpan}`
        : item.row;
    }

    return result;
  }, [item.column, item.row, item.colSpan, item.rowSpan]);

  return (
    <div
      className="widget-container p-4"
      style={style}
      data-widget-id={item.widgetId}
      data-instance-id={item.instanceId}
    >
      {children}
    </div>
  );
}

/**
 * Layout engine that renders widgets from configuration
 * Reads layout config and renders registered widgets in a grid
 */
export function LayoutEngine({
  layout,
  className = "",
}: LayoutEngineProps): ReactNode {
  const { registry, theme, capabilities, tenantId } = usePlatform();

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${layout.columns ?? 12}, minmax(0, 1fr))`,
      gap: `${layout.gap ?? 16}px`,
    }),
    [layout.columns, layout.gap]
  );

  if (!registry) {
    return (
      <div className="p-4 text-muted-foreground">
        No widget registry configured. Pass a registry to PlatformProvider.
      </div>
    );
  }

  return (
    <div className={`layout-engine ${className}`} style={gridStyle}>
      {layout.widgets.map((item) => {
        const definition = registry.get(item.widgetId);

        if (!definition) {
          return (
            <WidgetWrapper key={item.instanceId} item={item}>
              <div className="p-4 text-destructive text-sm">
                Widget "{item.widgetId}" not found in registry
              </div>
            </WidgetWrapper>
          );
        }

        const { Widget, manifest } = definition;

        // Merge default config with instance config
        const config = {
          ...manifest.defaultConfig,
          ...item.config,
        };

        return (
          <WidgetWrapper key={item.instanceId} item={item}>
            <WidgetProvider
              manifest={manifest}
              config={config}
              theme={theme}
              capabilities={capabilities}
              tenantId={tenantId}
            >
              <Widget config={config} />
            </WidgetProvider>
          </WidgetWrapper>
        );
      })}
    </div>
  );
}

/**
 * Empty state component for when no widgets are configured
 */
export function EmptyLayout(): ReactNode {
  return (
    <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
      <div className="text-center">
        <p className="text-lg">No widgets configured</p>
        <p className="text-sm mt-2">
          Add widgets to the layout configuration to see them here.
        </p>
      </div>
    </div>
  );
}
