import React from 'react';
import { FileQuestion, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-400">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">404 — Page Not Found</h1>
        <p className="text-sm text-slate-400 mb-6">The requested platform page does not exist or has been relocated.</p>
        <Button variant="primary" icon={Home} onClick={() => navigate('/dashboard')}>
          Back to Safety
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
