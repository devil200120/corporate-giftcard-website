import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6 p-6">
            <ExclamationTriangleIcon className="w-20 h-20 text-error-500" />
            
            <h1 className="text-3xl font-bold text-gray-900">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem continues.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="w-full bg-gray-100 p-4 rounded-lg border text-left text-sm font-mono overflow-auto max-h-48">
                <div className="font-semibold text-error-600 mb-2">
                  Error Details (Development Mode):
                </div>
                <pre className="whitespace-pre-wrap m-0">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo.componentStack && (
                  <pre className="whitespace-pre-wrap mt-2 text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                className="btn btn-primary inline-flex items-center gap-2"
                onClick={this.handleReload}
              >
                <ArrowPathIcon className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                className="btn btn-outline"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              
              <button
                className="btn btn-ghost inline-flex items-center gap-2"
                onClick={() => window.location.href = '/'}
              >
                <HomeIcon className="w-4 h-4" />
                Go Home
              </button>
            </div>

            <p className="text-sm text-gray-500">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
