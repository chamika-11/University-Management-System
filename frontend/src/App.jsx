import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initializeSession } from '@/store/authSlice';
import { router } from '@/app/router';
import { Toast } from '@/components/ui/Toast';
import { FullPageSpinner } from '@/components/ui/Spinner';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ULMS Web App ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-center">
          <div className="max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-slate-100 mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-400 mb-6">{this.state.error?.message || 'An unexpected error occurred in the application.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Bootstrap session on initial app mount
    dispatch(initializeSession());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} fallbackElement={<FullPageSpinner label="Loading application..." />} />
      <Toast />
    </ErrorBoundary>
  );
}

export default App;
