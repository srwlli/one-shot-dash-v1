import { createWidgetRegistry } from "@platform/core";
import { allWidgets } from "@platform/widgets";

/**
 * Create and configure the widget registry for this app
 * This is where apps compose widgets into the registry
 */
export function createRegistry() {
  const registry = createWidgetRegistry();

  // Register all platform widgets
  registry.registerAll(allWidgets, "@platform/widgets");

  return registry;
}
