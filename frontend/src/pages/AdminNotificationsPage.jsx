import React, { useState } from 'react';
import { Bell, Send, Megaphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Textarea, Select } from '@/components/forms/FormField';
import { useToast } from '@/hooks/useToast';

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!title || !message) {
      showToast({ message: 'Title and message content are required.', type: 'error' });
      return;
    }
    showToast({ message: `Broadcast message sent to ${targetAudience} users!`, type: 'success' });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-400" />
            System Broadcast & Notifications
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Dispatch announcements, system alerts, and notification templates to students & faculty.
          </p>
        </div>
      </div>

      <div className="card p-6 bg-slate-900 border border-white/10 max-w-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-400" /> Broadcast New Announcement
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <FormField label="Target Audience">
            <Select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
              <option value="ALL">🌐 All System Users (Students, Faculty & Staff)</option>
              <option value="STUDENTS">🎓 Students Only</option>
              <option value="FACULTY">👨‍🏫 Faculty Members Only</option>
            </Select>
          </FormField>

          <FormField label="Announcement Title">
            <Input placeholder="Midterm Examination Schedule Released" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>

          <FormField label="Notification Message Body">
            <Textarea rows={4} placeholder="Please review your portal timetable for updated examination venue allocations..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </FormField>

          <Button type="submit" variant="primary" size="md" className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Send className="w-4 h-4" /> Dispatch Broadcast
          </Button>
        </form>
      </div>
    </div>
  );
}
