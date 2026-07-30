import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserRoles, selectActiveRole, setActiveRole } from '@/store/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Check, Shield } from 'lucide-react';
import { formatRoleName } from '@/utils/formatters';

export function RoleSwitcher() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const roles = useSelector(selectUserRoles) || [];
  const activeRole = useSelector(selectActiveRole);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!roles || roles.length <= 1) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Shield className="w-3.5 h-3.5" />
        {formatRoleName(activeRole)}
      </span>
    );
  }

  const handleRoleChange = (role) => {
    if (role !== activeRole) {
      dispatch(setActiveRole(role));
      queryClient.clear(); // Purge cache across role switch
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
      >
        <Shield className="w-3.5 h-3.5 text-indigo-400" />
        <span>Context: {formatRoleName(activeRole)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/5">
            Switch View Context
          </div>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                role === activeRole
                  ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>{formatRoleName(role)}</span>
              {role === activeRole && <Check className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
