import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center px-4">
    <div className="text-8xl font-black text-slate-800">404</div>
    <div className="p-4 bg-slate-800/50 rounded-2xl">
      <Frown size={36} className="text-slate-600" />
    </div>
    <h1 className="text-xl font-bold text-slate-200">Page not found</h1>
    <p className="text-sm text-slate-500 max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
    <Link
      to="/dashboard"
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Home size={15} /> Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
