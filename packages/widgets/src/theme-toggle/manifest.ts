import type { WidgetManifest } from "@platform/sdk";

export const manifest: WidgetManifest = {
  id: "theme-toggle",
  name: "Theme Toggle",
  description: "Toggle between light, dark, and system theme modes.",
  version: "1.0.0",
  author: "Platform Team",
  category: "utility",
  tags: ["theme", "dark-mode", "settings"],
  permissions: {
    storage: "local",
    network: "none",
    notifications: "none",
  },
  defaultConfig: {
    showLabels: true,
    compact: false,
  },
  size: {
    minWidth: 150,
    minHeight: 60,
  },
};
