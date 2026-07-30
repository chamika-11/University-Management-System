import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSidebarOpen } from '@/store/uiSlice';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from '@/components/ui/Toast';

export function DashboardLayout() {
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <div className="flex-1 flex relative">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-200 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)] ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default DashboardLayout;
