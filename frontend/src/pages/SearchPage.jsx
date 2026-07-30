import React, { useState } from 'react';
import { useSearch } from '@/features/search/useSearch';
import { Input } from '@/components/forms/FormField';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Library, FileText } from 'lucide-react';

const iconMap = { course: BookOpen, book: Library, document: FileText, content: FileText };

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const { data, isLoading } = useSearch({ q: debounced });

  const results = Array.isArray(data) ? data : data?.results || [];
  const grouped = results.reduce((acc, r) => {
    const type = r.type || r._type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <Input
          id="global-search"
          placeholder="Search courses, books, content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 py-3 text-base"
          autoFocus
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : query.length < 2 ? (
        <div className="text-center py-12">
          <Search size={36} className="mx-auto text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">Type at least 2 characters to search</p>
        </div>
      ) : results.length === 0 ? (
        <EmptyState icon={Search} title="No results" description={`Nothing found for "${debounced}"`} />
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([type, items]) => {
            const Icon = iconMap[type] || FileText;
            return (
              <div key={type}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-2">
                  <Icon size={12} /> {type}s
                </p>
                <div className="space-y-1">
                  {items.map((r) => (
                    <div key={r._id || r.id} className="card-sm hover:border-indigo-500/20 transition-all duration-150">
                      <p className="text-sm font-medium text-slate-200">{r.title || r.name}</p>
                      {r.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{r.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
