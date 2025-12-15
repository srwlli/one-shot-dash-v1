/**
 * Hook Test Utilities
 * Helpers for testing React hooks
 */

import { renderHook, type RenderHookOptions, type RenderHookResult } from "@testing-library/react";
import React, { type ReactNode } from "react";

/**
 * Custom renderHook with providers
 */
export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> & {
    wrapper?: React.ComponentType<{ children: ReactNode }>;
  }
): RenderHookResult<TResult, TProps> {
  const { wrapper: Wrapper, ...renderOptions } = options || {};

  const AllProviders = ({ children }: { children: ReactNode }) => {
    if (Wrapper) {
      return <Wrapper>{children}</Wrapper>;
    }
    return <>{children}</>;
  };

  return renderHook(hook, {
    wrapper: AllProviders,
    ...renderOptions,
  });
}

/**
 * Wait for hook to update
 */
export async function waitForHookUpdate(ms = 0): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock context provider
 */
export function createMockContextProvider<T>(
  Context: React.Context<T>,
  value: T
): React.FC<{ children: ReactNode }> {
  return function MockProvider({ children }: { children: ReactNode }) {
    return React.createElement(Context.Provider, { value }, children);
  };
}
