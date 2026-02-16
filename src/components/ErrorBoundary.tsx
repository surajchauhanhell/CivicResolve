
import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md">
                    <h1 className="text-xl font-bold text-red-800">Something went wrong</h1>
                    <p className="mt-2 text-red-600">{this.state.error?.message}</p>
                    <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {this.state.error?.stack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
