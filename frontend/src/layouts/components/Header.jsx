import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '@/store/authSlice';
import { toggleSidebar } from '@/store/uiSlice';
import { authClient } from '@/api/authClient';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoleSwitcher } from './RoleSwitcher';
import { Menu, Bell, Search, User, LogOut, Shield } from 'lucide-react';

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector(selectUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.logout();
    } catch (e) {
      console.warn('[Header Logout]', e);
    } finally {
      queryClient.clear();
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-white text-base tracking-tighter shadow-md shadow-indigo-500/20">
            U
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-base hidden sm:inline-block">
            ULMS <span className="text-indigo-400 font-normal text-xs ml-1">Unified Platform</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RoleSwitcher />

        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold text-xs">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'User Account'}
              </p>
              <p className="text-[11px] text-slate-500">{user?.email}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs font-semibold text-slate-200">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
