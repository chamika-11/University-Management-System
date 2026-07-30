import React, { useState } from 'react';
import { useMyInvoices, useMyBalance, useProcessPayment } from '@/features/fee-payment/useFeePayment';
import { InvoiceCard } from '@/components/fee-payment/InvoiceCard';
import { PaymentModal } from '@/components/fee-payment/PaymentModal';
import { BalanceBadge } from '@/components/fee-payment/BalanceBadge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { CreditCard } from 'lucide-react';

const FeePaymentPage = () => {
  const { data: invoicesData, isLoading } = useMyInvoices();
  const { data: balanceData } = useMyBalance();
  const processPayment = useProcessPayment();
  const { showToast } = useToast();

  const [payingInvoice, setPayingInvoice] = useState(null);

  const invoices = Array.isArray(invoicesData) ? invoicesData : invoicesData?.invoices || [];
  const balance = balanceData?.balance ?? balanceData?.amount ?? balanceData;

  const handlePay = async (payload) => {
    try {
      await processPayment.mutateAsync(payload);
      setPayingInvoice(null);
      showToast({ message: 'Payment processed successfully!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Balance */}
      {balance !== undefined && balance !== null && (
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Ledger Balance</p>
            <BalanceBadge balance={typeof balance === 'number' ? balance : 0} />
          </div>
        </div>
      )}

      {/* Invoices */}
      <div className="card">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5">
          <CreditCard size={15} className="text-indigo-400" /> My Invoices
        </h2>
        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : invoices.length === 0 ? (
          <EmptyState icon={CreditCard} title="No invoices" description="Your fee invoices will appear here." />
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <InvoiceCard
                key={inv._id}
                invoice={inv}
                onPay={setPayingInvoice}
                isPaying={processPayment.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
        invoice={payingInvoice}
        onConfirm={handlePay}
        isProcessing={processPayment.isPending}
      />
    </div>
  );
};

export default FeePaymentPage;
