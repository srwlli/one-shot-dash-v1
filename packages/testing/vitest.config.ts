import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const rootDir = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: [path.resolve(__dirname, "src/setup.ts")],
    root: rootDir,
    include: [
      "packages/*/src/**/*.test.{ts,tsx}",
      "packages/*/src/__tests__/**/*.{ts,tsx}",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/apps/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "packages/*/src/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        "**/node_modules/**",
        "**/dist/**",
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "@platform/config": path.resolve(rootDir, "packages/config/src"),
      "@platform/core": path.resolve(rootDir, "packages/core/src"),
      "@platform/sdk": path.resolve(rootDir, "packages/sdk/src"),
      "@platform/ui": path.resolve(rootDir, "packages/ui/src"),
      "@platform/widgets": path.resolve(rootDir, "packages/widgets/src"),
    },
  },
});
