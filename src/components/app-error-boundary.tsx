import { Component } from "react";
import type { ErrorInfo, ReactElement, ReactNode } from "react";

import { captureException } from "@/services";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public override state: AppErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void captureException(error);
    if (import.meta.env.DEV) {
      console.error("AppErrorBoundary caught an error", error, errorInfo);
    }
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

function ErrorFallback(): ReactElement {
  return (
    <div className="bg-paper grid min-h-screen place-items-center px-6 text-center">
      <p className="text-ink-soft max-w-md text-sm">
        Something went wrong. The run was reported when monitoring is
        configured.
      </p>
    </div>
  );
}
