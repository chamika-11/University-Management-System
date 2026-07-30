import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts, useCreatePost } from '@/features/forum/useForum';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Textarea } from '@/components/forms/FormField';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { formatDate } from '@/utils/formatters';
import { MessageSquare, ThumbsUp, Plus, ChevronRight } from 'lucide-react';

const ForumPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({ page });
  const createPost = useCreatePost();
  const { showToast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  const posts = Array.isArray(data) ? data : data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createPost.mutateAsync(form);
      setShowCreate(false);
      setForm({ title: '', content: '' });
      showToast({ message: 'Post created!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">{posts.length} discussion{posts.length !== 1 ? 's' : ''}</p>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : posts.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No discussions yet" description="Start the first discussion!" action={<Button size="sm" onClick={() => setShowCreate(true)}>Create Post</Button>} />
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link key={post._id} to={`/forum/${post._id}`} className="block">
              <div className="card hover:border-indigo-500/20 transition-all duration-150 group">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.tag && <Badge color="indigo">{post.tag}</Badge>}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                      {post.title}
                    </h3>
                    {post.content && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{post.content}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                      <span>{post.author?.name || post.authorName || 'Student'}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={11} />{post.upvotes || 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} />{post.commentsCount || post.comments?.length || 0}</span>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-700 group-hover:text-slate-400 shrink-0 mt-1 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create Post Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Discussion Post" id="create-post-modal">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Title" id="post-title" required>
            <Input id="post-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What's your question or topic?" required />
          </FormField>
          <FormField label="Content" id="post-content" required>
            <Textarea id="post-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Describe your question or topic in detail…" required rows={5} />
          </FormField>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={createPost.isPending}>Post</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ForumPage;
