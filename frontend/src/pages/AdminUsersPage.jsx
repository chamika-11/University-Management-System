import React, { useState, useEffect, useCallback } from 'react';
import { userClient } from '@/api/userClient';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { FormField, Input, Select } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Users,
  UserPlus,
  Shield,
  GraduationCap,
  Briefcase,
  Search,
  Lock,
  Unlock,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Key,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { showToast } = useToast();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [profileTypeFilter, setProfileTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Create User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileType: 'STUDENT',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);

  // Lock Modal State
  const [lockTargetUser, setLockTargetUser] = useState(null);
  const [lockDuration, setLockDuration] = useState('60');
  const [lockLoading, setLockLoading] = useState(false);

  // Delete Modal State
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: pagination.limit,
      };
      if (profileTypeFilter) params.profileType = profileTypeFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await userClient.getUsers(params);
      const userList = res.data || [];
      setUsers(userList);
      if (res.pagination) {
        setPagination(res.pagination);
      } else {
        setPagination({ page: 1, limit: 10, total: userList.length, pages: 1 });
      }
    } catch (err) {
      const msg = parseError(err);
      setError(msg);
      showToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [profileTypeFilter, statusFilter, pagination.limit, showToast]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Search Filtering (Client-side search on fetched data)
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return fullName.includes(q) || email.includes(q);
  });

  // Calculate Statistics
  const stats = {
    total: pagination.total || users.length,
    students: users.filter((u) => u.profileType === 'STUDENT').length,
    faculty: users.filter((u) => u.profileType === 'FACULTY').length,
    admins: users.filter((u) => u.profileType === 'ADMIN' || u.role === 'ADMIN').length,
  };

  // Generate Random Secure Password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = 'U!ms';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateForm((prev) => ({ ...prev, password: pass }));
    setShowPassword(true);
  };

  // Validate Create Form
  const validateForm = () => {
    const errs = {};
    if (!createForm.firstName.trim()) errs.firstName = 'First name is required.';
    if (!createForm.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!createForm.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(createForm.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!createForm.password) {
      errs.password = 'Password is required.';
    } else if (createForm.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    return errs;
  };

  // Submit Create User
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setCreateLoading(true);

    try {
      await userClient.createUser({
        email: createForm.email.trim(),
        password: createForm.password,
        profileType: createForm.profileType,
        firstName: createForm.firstName.trim(),
        lastName: createForm.lastName.trim(),
      });

      showToast({
        message: `Successfully created ${createForm.profileType} account for ${createForm.firstName}!`,
        type: 'success',
      });

      // Reset form and close modal
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profileType: 'STUDENT',
      });
      setIsCreateModalOpen(false);

      // Refresh list
      fetchUsers(1);
    } catch (err) {
      const msg = parseError(err);
      setFormErrors({ api: msg });
      showToast({ message: msg, type: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle Account Lock/Unlock
  const handleLockAccount = async () => {
    if (!lockTargetUser) return;
    setLockLoading(true);
    try {
      if (lockTargetUser.status === 'LOCKED' || lockTargetUser.isLocked) {
        await userClient.unlockUser(lockTargetUser._id || lockTargetUser.id);
        showToast({ message: `Account for ${lockTargetUser.email} has been unlocked.`, type: 'success' });
      } else {
        await userClient.lockUser(lockTargetUser._id || lockTargetUser.id, parseInt(lockDuration, 10));
        showToast({ message: `Account for ${lockTargetUser.email} locked for ${lockDuration} minutes.`, type: 'success' });
      }
      setLockTargetUser(null);
      fetchUsers(pagination.page);
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    } finally {
      setLockLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteAccount = async () => {
    if (!deleteTargetUser) return;
    setDeleteLoading(true);
    try {
      await userClient.deleteUser(deleteTargetUser._id || deleteTargetUser.id);
      showToast({ message: `User ${deleteTargetUser.email} was permanently deleted.`, type: 'success' });
      setDeleteTargetUser(null);
      fetchUsers(pagination.page);
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Role Badge Helper
  const renderProfileBadge = (type) => {
    switch (type) {
      case 'ADMIN':
        return <Badge variant="indigo">Admin</Badge>;
      case 'FACULTY':
        return <Badge variant="sky">Faculty</Badge>;
      case 'STAFF':
        return <Badge variant="amber">Staff</Badge>;
      case 'STUDENT':
      default:
        return <Badge variant="emerald">Student</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-400" />
            User Account Management
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Provision new accounts, configure user profiles, and manage security locks across the institution.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Create New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3 bg-slate-900/60 border border-white/5">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{stats.total}</div>
            <div className="text-xs text-slate-400 font-medium">Total Accounts</div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 bg-slate-900/60 border border-white/5">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{stats.students}</div>
            <div className="text-xs text-slate-400 font-medium">Students</div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 bg-slate-900/60 border border-white/5">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{stats.faculty}</div>
            <div className="text-xs text-slate-400 font-medium">Faculty Members</div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3 bg-slate-900/60 border border-white/5">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{stats.admins}</div>
            <div className="text-xs text-slate-400 font-medium">Administrators</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="card p-4 bg-slate-900/80 border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Filters & Refresh */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-1/2 md:w-44">
              <Select
                value={profileTypeFilter}
                onChange={(e) => setProfileTypeFilter(e.target.value)}
                className="text-xs"
              >
                <option value="">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
              </Select>
            </div>

            <div className="w-1/2 md:w-44">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="LOCKED">Locked</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(pagination.page)}
              title="Refresh user list"
              className="shrink-0 p-2 text-slate-400 hover:text-slate-100"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading && users.length === 0 ? (
          <div className="p-12 text-center">
            <FullPageSpinner label="Fetching user directory..." />
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description={
              searchQuery || profileTypeFilter || statusFilter
                ? 'No users match your active filter criteria. Try clearing search filters.'
                : 'No user accounts have been created yet.'
            }
            action={
              <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Create First User
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-6">User Profile</th>
                  <th className="py-3.5 px-4">Role / Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Email Verification</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const initial = (u.firstName?.[0] || u.email?.[0] || 'U').toUpperCase();
                  const isLocked = u.status === 'LOCKED' || u.isLocked;

                  return (
                    <tr key={u._id || u.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100">
                              {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email.split('@')[0]}
                            </div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Profile Type */}
                      <td className="py-4 px-4">{renderProfileBadge(u.profileType || u.role)}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={u.status || 'ACTIVE'} />
                      </td>

                      {/* Verification Status */}
                      <td className="py-4 px-4">
                        {u.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Unverified
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 text-xs text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Lock / Unlock */}
                          <button
                            onClick={() => setLockTargetUser(u)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isLocked
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                                : 'bg-slate-800 border-white/5 text-slate-400 hover:text-slate-100 hover:bg-slate-700'
                            }`}
                            title={isLocked ? 'Unlock Account' : 'Lock Account'}
                          >
                            {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => setDeleteTargetUser(u)}
                            className="p-1.5 rounded-lg border bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/40">
            <div className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-200">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-200">{pagination.pages}</span> (Total {pagination.total}{' '}
              accounts)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchUsers(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchUsers(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW USER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Institution User"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formErrors.api && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium flex items-center gap-2">
              <span>⚠️</span> {formErrors.api}
            </div>
          )}

          {/* Profile Type Selector */}
          <FormField label="Account Role / Profile Type" error={formErrors.profileType}>
            <Select
              value={createForm.profileType}
              onChange={(e) => setCreateForm({ ...createForm, profileType: e.target.value })}
            >
              <option value="STUDENT">🎓 Student Account</option>
              <option value="FACULTY">👨‍🏫 Faculty Member</option>
              <option value="ADMIN">🛡️ Administrator</option>
              <option value="STAFF">📋 Staff Officer</option>
            </Select>
          </FormField>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" error={formErrors.firstName}>
              <Input
                placeholder="John"
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
              />
            </FormField>
            <FormField label="Last Name" error={formErrors.lastName}>
              <Input
                placeholder="Doe"
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
              />
            </FormField>
          </div>

          {/* Email Address */}
          <FormField label="Institutional Email Address" error={formErrors.email}>
            <Input
              type="email"
              placeholder="newuser@ulms.edu"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />
          </FormField>

          {/* Password Input with Visibility Toggle & Auto Generator */}
          <FormField label="Initial Password" error={formErrors.password}>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Generator Button */}
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Key className="w-3.5 h-3.5" /> Auto-generate secure password
              </button>
            </div>
          </FormField>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createLoading}>
              {createLoading ? 'Creating User…' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* LOCK / UNLOCK MODAL */}
      <Modal
        isOpen={!!lockTargetUser}
        onClose={() => setLockTargetUser(null)}
        title={lockTargetUser?.status === 'LOCKED' ? 'Unlock Account' : 'Lock User Account'}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            {lockTargetUser?.status === 'LOCKED'
              ? `Are you sure you want to unlock the account for ${lockTargetUser?.email}? The user will regain platform access immediately.`
              : `Are you sure you want to lock the account for ${lockTargetUser?.email}? The user will be barred from signing in.`}
          </p>

          {lockTargetUser?.status !== 'LOCKED' && (
            <FormField label="Lock Duration">
              <Select value={lockDuration} onChange={(e) => setLockDuration(e.target.value)}>
                <option value="60">1 Hour (60 mins)</option>
                <option value="720">12 Hours</option>
                <option value="1440">24 Hours (1 Day)</option>
                <option value="10080">7 Days</option>
              </Select>
            </FormField>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" onClick={() => setLockTargetUser(null)}>
              Cancel
            </Button>
            <Button
              variant={lockTargetUser?.status === 'LOCKED' ? 'primary' : 'danger'}
              loading={lockLoading}
              onClick={handleLockAccount}
            >
              {lockTargetUser?.status === 'LOCKED' ? 'Unlock Account' : 'Lock Account'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!deleteTargetUser}
        onClose={() => setDeleteTargetUser(null)}
        title="Delete User Account"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            ⚠️ <strong>Warning:</strong> Deleting <strong>{deleteTargetUser?.email}</strong> is permanent and cannot be undone.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" onClick={() => setDeleteTargetUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleteLoading} onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
