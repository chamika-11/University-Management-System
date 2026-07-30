import React from 'react';
import { useMyNotifications, usePreferences, useUpdatePreferences } from '@/features/notifications/useNotifications';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/hooks/useToast';
import { formatDateTime } from '@/utils/formatters';
import { Bell, Settings } from 'lucide-react';
import { useState } from 'react';

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyNotifications(page);
  const { data: prefs } = usePreferences();
  const updatePrefs = useUpdatePreferences();
  const { showToast } = useToast();
  const [showPrefs, setShowPrefs] = useState(false);

  const notifications = Array.isArray(data) ? data : data?.notifications || [];
  const totalPages = data?.totalPages || 1;

  const handleTogglePref = async (key) => {
    if (!prefs) return;
    const updated = { ...prefs, [key]: !prefs[key] };
    try {
      await updatePrefs.mutateAsync(updated);
    } catch {
      showToast({ message: 'Failed to update preference.', type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Preferences Toggle */}
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => setShowPrefs((v) => !v)}>
          <Settings size={14} /> {showPrefs ? 'Hide' : 'Show'} Preferences
        </Button>
      </div>

      {showPrefs && prefs && (
        <div className="card animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {Object.entries(prefs).filter(([k]) => typeof prefs[k] === 'boolean').map(([key, val]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div
                  onClick={() => handleTogglePref(key)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${val ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${val ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Notifications list */}
      <div className="card">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5">
          <Bell size={15} className="text-indigo-400" /> Notifications
        </h2>
        {isLoading ? <PageSpinner /> : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!n.read ? 'bg-indigo-500/5 border border-indigo-500/10' : 'hover:bg-white/[0.02]'}`}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{n.message || n.title}</p>
                  {n.body && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
                  <p className="text-xs text-slate-600 mt-1">{formatDateTime(n.createdAt)}</p>
                </div>
                {n.type && <Badge color="slate">{n.type}</Badge>}
              </div>
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default NotificationsPage;
