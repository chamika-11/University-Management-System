import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePost, useComments, useCreateComment, useUpvote } from '@/features/forum/useForum';
import { FormField, Textarea } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatDateTime } from '@/utils/formatters';
import { ArrowLeft, ThumbsUp, MessageSquare, Send } from 'lucide-react';

const ForumPostPage = () => {
  const { postId } = useParams();
  const { data: post, isLoading } = usePost(postId);
  const { data: commentsData, isLoading: cLoading } = useComments(postId);
  const createComment = useCreateComment(postId);
  const upvote = useUpvote(postId);
  const [comment, setComment] = useState('');

  const comments = Array.isArray(commentsData) ? commentsData : commentsData?.comments || [];

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await createComment.mutateAsync({ content: comment });
    setComment('');
  };

  if (isLoading) return <PageSpinner />;
  if (!post) return <div className="card"><p className="text-sm text-slate-400">Post not found.</p></div>;

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link to="/forum" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Forum
      </Link>

      {/* Post */}
      <div className="card mb-4">
        <h2 className="text-lg font-bold text-slate-100 mb-2">{post.title}</h2>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span>{post.author?.name || post.authorName || 'Student'}</span>
          <span>{formatDateTime(post.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
          <button
            onClick={() => upvote.mutate()}
            disabled={upvote.isPending}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors"
            aria-label="Upvote post"
          >
            <ThumbsUp size={15} className={upvote.isPending ? 'text-indigo-400' : ''} />
            {post.upvotes || 0} upvotes
          </button>
          <span className="flex items-center gap-1.5 text-sm text-slate-600">
            <MessageSquare size={15} /> {comments.length} comments
          </span>
        </div>
      </div>

      {/* Comments */}
      <div
        className="space-y-3 mb-4"
        role="log"
        aria-live="polite"
        aria-label="Discussion comments"
      >
        <h3 className="text-sm font-semibold text-slate-400">{comments.length} Comments</h3>
        {cLoading ? (
          <div className="card animate-pulse h-20" />
        ) : comments.length === 0 ? (
          <div className="card text-center">
            <p className="text-sm text-slate-500">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className={`card-sm animate-fade-in ${c.isOptimistic ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{c.author?.name || c.authorName || 'Student'}</span>
                <span className="text-xs text-slate-600">{formatDateTime(c.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Add a Comment</h3>
        <form onSubmit={handleComment} className="space-y-3">
          <Textarea
            id="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment… (Shift+Enter for newline)"
            rows={3}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(e); } }}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={createComment.isPending} disabled={!comment.trim()}>
              <Send size={14} /> Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumPostPage;
