import type { WidgetManifest } from "@platform/sdk";

export const manifest: WidgetManifest = {
  id: "coming-soon-card",
  name: "Coming Soon Card",
  description: "A placeholder card for upcoming features with customizable title and description.",
  version: "1.0.0",
  author: "Platform Team",
  category: "utility",
  tags: ["placeholder", "coming-soon", "card"],
  permissions: {
    storage: "none",
    network: "none",
    notifications: "none",
  },
  defaultConfig: {
    title: "Coming Soon",
    description: "This feature is under development.",
    icon: "rocket",
  },
  size: {
    minWidth: 200,
    minHeight: 100,
  },
};
