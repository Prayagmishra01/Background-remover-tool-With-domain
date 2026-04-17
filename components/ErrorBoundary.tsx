'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '@/lib/errorTracker';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report the error quietly to our backend without exposing data to the user
    reportError(error, "general", "critical");
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <AlertTriangle className="w-12 h-12 text-black mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong.</h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            We encountered an unexpected issue while processing your request. Please refresh the page and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
