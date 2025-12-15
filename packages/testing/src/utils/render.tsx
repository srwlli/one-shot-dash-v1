/**
 * Custom Render Utility
 * Wraps components with necessary providers for testing
 */

import React, { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";

/**
 * All providers wrapper for tests
 */
interface AllProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps): ReactElement {
  // Add providers as needed (Theme, Platform, etc.)
  return <>{children}</>;
}

/**
 * Custom render options
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  /** Initial route for routing tests */
  route?: string;
  /** Custom wrapper component */
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

/**
 * Custom render function with providers
 */
function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { wrapper: Wrapper, ...renderOptions } = options;

  const FinalWrapper = ({ children }: { children: ReactNode }) => {
    if (Wrapper) {
      return (
        <AllProviders>
          <Wrapper>{children}</Wrapper>
        </AllProviders>
      );
    }
    return <AllProviders>{children}</AllProviders>;
  };

  return render(ui, { wrapper: FinalWrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render with custom render
export { customRender as render };
