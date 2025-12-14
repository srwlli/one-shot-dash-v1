// Coming Soon Card Widget
export { Widget as ComingSoonCard } from "./coming-soon-card/Widget";
export { manifest as comingSoonCardManifest } from "./coming-soon-card/manifest";

// Theme Toggle Widget
export { Widget as ThemeToggle } from "./theme-toggle/Widget";
export { manifest as themeToggleManifest } from "./theme-toggle/manifest";

// Widget definitions for registry
import { Widget as ComingSoonCardWidget } from "./coming-soon-card/Widget";
import { manifest as comingSoonCardManifest } from "./coming-soon-card/manifest";
import { Widget as ThemeToggleWidget } from "./theme-toggle/Widget";
import { manifest as themeToggleManifest } from "./theme-toggle/manifest";

import type { WidgetDefinition } from "@platform/sdk";

/**
 * Coming Soon Card widget definition
 */
export const comingSoonCardDefinition: WidgetDefinition = {
  Widget: ComingSoonCardWidget,
  manifest: comingSoonCardManifest,
};

/**
 * Theme Toggle widget definition
 */
export const themeToggleDefinition: WidgetDefinition = {
  Widget: ThemeToggleWidget,
  manifest: themeToggleManifest,
};

/**
 * All widget definitions for easy registration
 */
export const allWidgets: WidgetDefinition[] = [
  comingSoonCardDefinition,
  themeToggleDefinition,
];
