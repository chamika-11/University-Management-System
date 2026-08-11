import React, { useState } from 'react';
import { ROLE_PERMISSIONS_MAP } from '@/access-control/rolePermissions';
import { PERMISSIONS } from '@/access-control/permissions';
import { Badge } from '@/components/ui/Badge';
import { FormField, Input, Select } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { ShieldCheck, Search, CheckCircle2, Lock, ShieldAlert, Sliders } from 'lucide-react';

export default function AdminRolesPage() {
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');

  const permissionsList = Object.entries(PERMISSIONS).map(([key, val]) => ({
    key,
    value: val,
    domain: val.split(':')[0].toUpperCase(),
  }));

  const activePermissions = new Set(ROLE_PERMISSIONS_MAP[selectedRole] || []);

  const filteredPermissions = permissionsList.filter(
    (p) =>
      p.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePermission = (permValue) => {
    showToast({
      message: `Role permissions for ${selectedRole} updated! (${permValue})`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            RBAC Roles & Permission Matrix
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Configure authorization rules, role capabilities, and fine-grained access control strings.
          </p>
        </div>
      </div>

      {/* Role Selection & Filter Bar */}
      <div className="card p-4 bg-slate-900/80 border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['ADMIN', 'FACULTY', 'STAFF', 'STUDENT'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedRole === role
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Permission Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPermissions.map((perm) => {
          const isEnabled = activePermissions.has(perm.value);

          return (
            <div
              key={perm.key}
              className={`card p-4 border transition-all ${
                isEnabled
                  ? 'bg-indigo-950/20 border-indigo-500/30'
                  : 'bg-slate-900/60 border-white/5 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={isEnabled ? 'indigo' : 'slate'}>{perm.domain}</Badge>
                <button
                  onClick={() => handleTogglePermission(perm.value)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                  title="Toggle Permission"
                >
                  {isEnabled ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              </div>

              <div className="font-mono text-sm font-semibold text-slate-200">{perm.value}</div>
              <div className="text-xs text-slate-500 mt-1">Permission string identifier for authorization guards.</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
