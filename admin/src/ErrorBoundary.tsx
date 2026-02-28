import React, { ErrorInfo } from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'monospace', color: '#ff0000', backgroundColor: '#fee' }}>
          <h1>Ứng dụng bị lỗi (Crash)</h1>
          <h3>{this.state.error && this.state.error.toString()}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '10px' }}>
            {this.state.error?.stack}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '10px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
