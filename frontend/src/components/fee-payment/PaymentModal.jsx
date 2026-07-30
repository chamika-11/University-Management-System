import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/forms/FormField';
import { formatCurrency } from '@/utils/formatters';

export function PaymentModal({ isOpen, onClose, invoice, onConfirm, isProcessing }) {
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');

  if (!invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      invoiceId: invoice._id,
      amount: invoice.amount,
      paymentMethod,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Fee Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-xs space-y-1">
          <p className="text-slate-400">Invoice: <span className="text-slate-200 font-semibold">{invoice.title || invoice._id}</span></p>
          <p className="text-slate-400">Total Amount Due: <span className="text-indigo-400 font-bold">{formatCurrency(invoice.amount)}</span></p>
        </div>

        <FormField label="Payment Method">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100"
          >
            <option value="CARD">Credit / Debit Card</option>
            <option value="BANK_TRANSFER">Bank Wire Transfer</option>
          </select>
        </FormField>

        {paymentMethod === 'CARD' && (
          <FormField label="Card Number">
            <Input
              type="text"
              placeholder="•••• •••• •••• ••••"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </FormField>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isProcessing}>
            Confirm Payment ({formatCurrency(invoice.amount)})
          </Button>
        </div>
      </form>
    </Modal>
  );
}
