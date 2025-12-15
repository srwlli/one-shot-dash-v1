"use client";

import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Theme mode type
 */
type ThemeMode = "light" | "dark" | "system";

/**
 * Icons for theme modes
 */
const ThemeIcons: Record<ThemeMode, React.ReactNode> = {
  light: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  dark: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  system: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export interface ThemeToggleProps {
  /** Current theme mode */
  mode?: ThemeMode;
  /** Callback when theme changes */
  onModeChange?: (mode: ThemeMode) => void;
  /** Show labels next to icons */
  showLabels?: boolean;
  /** Compact single-button mode */
  compact?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */
const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(
  (
    {
      mode = "system",
      onModeChange,
      showLabels = false,
      compact = true,
      className,
    },
    ref
  ) => {
    const modes: ThemeMode[] = ["light", "dark", "system"];

    const handleThemeChange = (newMode: ThemeMode) => {
      // Dispatch custom event for theme change (PlatformProvider listens)
      const event = new CustomEvent("platform:theme-change", {
        detail: { mode: newMode },
        bubbles: true,
      });
      document.dispatchEvent(event);

      // Also call the callback if provided
      onModeChange?.(newMode);
    };

    if (compact) {
      // Compact mode: single button that cycles through modes
      const currentIndex = modes.indexOf(mode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      const icon = ThemeIcons[mode];

      return (
        <button
          onClick={() => handleThemeChange(nextMode)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border border-input bg-background p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          title={`Current: ${mode}. Click to switch to ${nextMode}`}
        >
          {icon}
          {showLabels && <span className="text-sm capitalize">{mode}</span>}
        </button>
      );
    }

    // Full mode: button group
    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)}>
        {showLabels && (
          <span className="text-sm font-medium text-foreground">Theme</span>
        )}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => handleThemeChange(m)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={`Switch to ${m} mode`}
            >
              {ThemeIcons[m]}
              {showLabels && <span className="capitalize">{m}</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
