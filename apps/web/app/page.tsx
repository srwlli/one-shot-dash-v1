"use client";

import { Dashboard } from "@platform/core";
import { layouts } from "@platform/config";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard
        layout={layouts.dashboard}
        title="Business Dashboard"
        actions={
          <Link
            href="/settings"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Settings
          </Link>
        }
      />
    </div>
  );
}
