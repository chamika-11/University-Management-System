import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectToast, clearToast } from '@/store/uiSlice';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-200',
    error: 'border-rose-500/30 bg-slate-900/95 text-rose-200',
    warning: 'border-amber-500/30 bg-slate-900/95 text-amber-200',
    info: 'border-indigo-500/30 bg-slate-900/95 text-indigo-200',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-left max-w-sm">
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl ${borders[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <p className="text-sm font-medium text-slate-200 flex-1">{toast.message}</p>
        <button
          onClick={() => dispatch(clearToast())}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
