import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookSearch, useCheckout } from '@/features/library/useLibrary';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Input } from '@/components/forms/FormField';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { useDebounce } from '@/hooks/useDebounce';
import { Library, Search, Book, BookOpen } from 'lucide-react';

const BookCard = ({ book, onCheckout, isCheckingOut }) => (
  <div className="card flex flex-col gap-3 hover:border-indigo-500/20 transition-all duration-200">
    {/* Book cover placeholder */}
    <div className="h-32 bg-gradient-to-br from-indigo-900/40 to-slate-800 rounded-lg flex items-center justify-center">
      <BookOpen size={28} className="text-indigo-400/50" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-1">{book.title}</h3>
      {book.author && <p className="text-xs text-slate-500">{book.author}</p>}
      {book.isbn && <p className="text-xs text-slate-600 font-mono mt-0.5">ISBN: {book.isbn}</p>}
    </div>
    <div className="flex items-center justify-between">
      <Badge color={book.available || book.availableCopies > 0 ? 'emerald' : 'rose'} dot>
        {book.available || book.availableCopies > 0 ? 'Available' : 'Unavailable'}
      </Badge>
      {(book.available || book.availableCopies > 0) && (
        <Button size="xs" loading={isCheckingOut} onClick={() => onCheckout(book._id)}>
          Check Out
        </Button>
      )}
    </div>
  </div>
);

const LibraryPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);
  const { data, isLoading } = useBookSearch({ q: debouncedSearch, page, limit: 12 });
  const checkout = useCheckout();
  const { showToast } = useToast();

  const books = Array.isArray(data) ? data : data?.books || data?.data || [];
  const totalPages = data?.totalPages || data?.pages || 1;

  const handleCheckout = async (bookId) => {
    try {
      await checkout.mutateAsync(bookId);
      showToast({ message: 'Book checked out! Visit My Loans to view it.', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <Input
            id="library-search"
            placeholder="Search books by title, author, ISBN…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Link to="/library/loans">
          <Button variant="secondary" size="sm"><Book size={14} /> My Loans</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <EmptyState icon={Library} title="No books found" description={search ? 'Try a different search term.' : 'The library catalog is empty.'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onCheckout={handleCheckout} isCheckingOut={checkout.isPending} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default LibraryPage;
