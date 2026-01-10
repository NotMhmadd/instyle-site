import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 md:p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-serif text-[#1C1B1A] mb-3">Something went wrong</h1>
            <p className="text-[#666] mb-8">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E5E5E5] text-[#1C1B1A] font-bold uppercase text-xs tracking-widest rounded-lg hover:border-[#C5A059] transition-colors"
              >
                <Home size={16} />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
