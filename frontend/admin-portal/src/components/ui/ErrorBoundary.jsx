import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 text-center">
          <div className="portal-card max-w-xl rounded-3xl p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Admin Portal</p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--brand-strong)]">Application error</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
              The portal hit an unrecoverable render error. Reload the page or return to the dashboard shell.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}