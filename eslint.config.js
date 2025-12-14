import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },

  // Base TypeScript config for all files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        CustomEvent: "readonly",
        EventListener: "readonly",
        HTMLElement: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        MediaQueryListEvent: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        // Node.js globals for build scripts
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // BOUNDARY ENFORCEMENT: packages/widgets can ONLY import @platform/sdk
  {
    files: ["packages/widgets/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@platform/core", "@platform/core/*"],
              message:
                "Widgets cannot import @platform/core. Use @platform/sdk only.",
            },
            {
              group: ["@platform/config", "@platform/config/*"],
              message:
                "Widgets cannot import @platform/config. Use @platform/sdk only.",
            },
            {
              group: ["@platform/ui", "@platform/ui/*"],
              message:
                "Widgets cannot import @platform/ui. Use @platform/sdk only.",
            },
            {
              group: ["electron", "electron/*"],
              message: "Widgets cannot import electron.",
            },
          ],
        },
      ],
    },
  },

  // BOUNDARY ENFORCEMENT: packages/core cannot import widgets
  {
    files: ["packages/core/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@platform/widgets", "@platform/widgets/*"],
              message:
                "Core cannot import widgets. Apps compose widgets into registry.",
            },
            {
              group: ["electron", "electron/*"],
              message: "Core cannot import electron.",
            },
          ],
        },
      ],
    },
  },

  // BOUNDARY ENFORCEMENT: apps/web cannot import electron
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["electron", "electron/*"],
              message:
                "Web app cannot import electron. Use platform detection instead.",
            },
          ],
        },
      ],
    },
  },

  // BOUNDARY ENFORCEMENT: packages/sdk should have no platform dependencies
  {
    files: ["packages/sdk/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@platform/core", "@platform/core/*"],
              message: "SDK cannot import core. SDK is the foundation layer.",
            },
            {
              group: ["@platform/widgets", "@platform/widgets/*"],
              message: "SDK cannot import widgets.",
            },
            {
              group: ["@platform/config", "@platform/config/*"],
              message: "SDK cannot import config.",
            },
            {
              group: ["@platform/ui", "@platform/ui/*"],
              message: "SDK cannot import UI.",
            },
            {
              group: ["electron", "electron/*"],
              message: "SDK cannot import electron.",
            },
          ],
        },
      ],
    },
  },
];
