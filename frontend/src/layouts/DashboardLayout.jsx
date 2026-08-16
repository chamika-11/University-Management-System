import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../app/store';
import { Button } from '../components/ui/Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/roles', label: 'Roles' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/semesters', label: 'Semesters' },
  { to: '/timetable', label: 'Timetable' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/finance', label: 'Finance' },
  { to: '/reports', label: 'Reports' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/documents', label: 'Documents' },
  { to: '/search', label: 'Search' },
];

export function DashboardLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="app-shell grid min-h-screen bg-transparent lg:grid-cols-[280px_1fr]">
      <aside className={`border-r border-[var(--border)] bg-white/75 backdrop-blur ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex h-full flex-col p-5">
          <div className="rounded-3xl bg-[var(--brand)] px-5 py-6 text-white shadow-lg shadow-sky-950/10">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">ULMS</div>
            <div className="mt-2 text-2xl font-semibold leading-tight">Admin Portal</div>
            <p className="mt-3 text-sm text-white/80">Registrar, finance, and platform operations in one place.</p>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-[var(--surface-soft)] text-[var(--brand-strong)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--brand-strong)]'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm">
            <div className="font-semibold text-[var(--brand-strong)]">{user.email}</div>
            <div className="mt-1 text-[var(--text-muted)]">Role: {user.role}</div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-white/70 px-4 py-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">University management system</p>
            <h1 className="mt-1 text-xl font-semibold text-[var(--brand-strong)]">Administration workspace</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => dispatch(toggleSidebar())}>
              Toggle menu
            </Button>
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-strong)]">
              {user.role}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}