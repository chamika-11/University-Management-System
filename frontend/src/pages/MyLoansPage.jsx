import React from 'react';
import { useMyLoans, useRenewLoan } from '@/features/library/useLibrary';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { formatDate } from '@/utils/formatters';
import { BookCopy, RefreshCw } from 'lucide-react';

const MyLoansPage = () => {
  const { data, isLoading } = useMyLoans();
  const renewLoan = useRenewLoan();
  const { showToast } = useToast();

  const loans = Array.isArray(data) ? data : data?.loans || [];

  const handleRenew = async (loanId) => {
    try {
      await renewLoan.mutateAsync(loanId);
      showToast({ message: 'Loan renewed!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="card">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5">
          <BookCopy size={15} className="text-indigo-400" /> My Loans
        </h2>
        {isLoading ? <PageSpinner /> : loans.length === 0 ? (
          <EmptyState icon={BookCopy} title="No active loans" description="Books you check out will appear here." />
        ) : (
          <Table>
            <Thead>
              <tr><Th>Book</Th><Th>Author</Th><Th>Checked Out</Th><Th>Due Date</Th><Th>Status</Th><Th>Action</Th></tr>
            </Thead>
            <Tbody>
              {loans.map((loan) => {
                const isOverdue = loan.dueDate && new Date(loan.dueDate) < new Date() && loan.status !== 'RETURNED';
                return (
                  <Tr key={loan._id}>
                    <Td className="font-medium text-slate-200">{loan.bookTitle || loan.book?.title || '—'}</Td>
                    <Td className="text-slate-500">{loan.bookAuthor || loan.book?.author || '—'}</Td>
                    <Td>{formatDate(loan.checkedOutAt || loan.checkoutDate)}</Td>
                    <Td className={isOverdue ? 'text-rose-400 font-medium' : ''}>{formatDate(loan.dueDate)}</Td>
                    <Td><StatusBadge status={isOverdue ? 'OVERDUE' : loan.status || 'CHECKED_OUT'} /></Td>
                    <Td>
                      {loan.status !== 'RETURNED' && (
                        <Button size="xs" variant="secondary" loading={renewLoan.isPending} onClick={() => handleRenew(loan._id)}>
                          <RefreshCw size={12} /> Renew
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MyLoansPage;
