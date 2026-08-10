import React, { useState } from 'react';
import { DollarSign, CreditCard, ArrowUpRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const mockInvoices = [
  { id: 'INV-2026-001', student: 'John Doe', amount: '$2,450.00', dueDate: '2026-09-15', status: 'PAID' },
  { id: 'INV-2026-002', student: 'Alice Smith', amount: '$2,450.00', dueDate: '2026-09-15', status: 'UNPAID' },
  { id: 'INV-2026-003', student: 'Bob Johnson', amount: '$1,800.00', dueDate: '2026-08-30', status: 'OVERDUE' },
  { id: 'INV-2026-004', student: 'Carol Williams', amount: '$2,450.00', dueDate: '2026-09-15', status: 'PAID' },
];

export default function AdminFinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-indigo-400" />
            Financial Oversight & Tuition Fee Governance
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Track university revenue collections, student fee invoices, and outstanding balances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-slate-900 border border-white/5 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Collected (This Term)</div>
          <div className="text-3xl font-extrabold text-emerald-400">$1,452,900</div>
        </div>
        <div className="card p-5 bg-slate-900 border border-white/5 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Pending Unpaid Fees</div>
          <div className="text-3xl font-extrabold text-amber-400">$342,150</div>
        </div>
        <div className="card p-5 bg-slate-900 border border-white/5 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Overdue Balances</div>
          <div className="text-3xl font-extrabold text-rose-400">$48,200</div>
        </div>
      </div>

      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/5 font-semibold text-slate-100">Recent Student Fee Invoices</div>
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Invoice ID & Student</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-100">{inv.student} <span className="text-xs text-slate-400 block font-normal">{inv.id}</span></td>
                <td className="py-4 px-4 font-mono font-bold text-slate-200">{inv.amount}</td>
                <td className="py-4 px-4 text-xs text-slate-400">{inv.dueDate}</td>
                <td className="py-4 px-4"><StatusBadge status={inv.status} /></td>
                <td className="py-4 px-6 text-right"><Button variant="outline" size="sm">View Receipt</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
