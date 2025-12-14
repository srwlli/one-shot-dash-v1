"use client";

import Link from "next/link";
import { WidgetProvider } from "@platform/sdk";
import { usePlatform } from "@platform/core";
import { ThemeToggle, themeToggleManifest } from "@platform/widgets";

export default function SettingsPage() {
  const { theme, capabilities } = usePlatform();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl space-y-8">
        {/* Theme Section */}
        <section className="widget-container p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Appearance
          </h2>
          <WidgetProvider
            manifest={themeToggleManifest}
            config={{ showLabels: true, compact: false }}
            theme={theme}
            capabilities={capabilities}
          >
            <ThemeToggle />
          </WidgetProvider>
        </section>

        {/* Platform Info Section */}
        <section className="widget-container p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Platform Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform</span>
              <span className="text-foreground">
                {capabilities.isElectron
                  ? "Desktop (Electron)"
                  : capabilities.isPWA
                    ? "PWA"
                    : "Web"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">File System Access</span>
              <span className="text-foreground">
                {capabilities.features.fileSystem ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notifications</span>
              <span className="text-foreground">
                {capabilities.features.notifications ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offline Support</span>
              <span className="text-foreground">
                {capabilities.features.offline ? "Available" : "Not Available"}
              </span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="widget-container p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Business Dashboard v1.0.0</p>
            <p>A cross-platform widget hosting dashboard built with Next.js, React, and Electron.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
